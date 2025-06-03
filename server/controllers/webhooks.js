import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";



// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    // Getting Data from request body
    const { data, type } = req.body

    // Switch Cases for differernt Events
    switch (type) {
      case 'user.created': {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// Stripe Webhooks to Manage Payments Action
export const stripeWebhooks = async (request, response) => {
  console.log('🔔 Stripe webhook received');
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook signature verified successfully');
  }
  catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`ℹ️ Processing event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      try {
        console.log('💰 Processing successful payment...');
        
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        console.log(`ℹ️ Payment Intent ID: ${paymentIntentId}`);

        // Getting Session Metadata
        console.log('🔍 Retrieving checkout session...');
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessions.data || sessions.data.length === 0) {
          throw new Error('No checkout session found for this payment intent');
        }

        const session = sessions.data[0];
        console.log('✅ Checkout session found');

        if (!session.metadata || !session.metadata.purchaseId) {
          throw new Error('No purchaseId found in session metadata');
        }

        const { purchaseId } = session.metadata;
        console.log(`ℹ️ Purchase ID: ${purchaseId}`);

        // Fetch purchase data
        console.log('🔍 Fetching purchase data...');
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          throw new Error(`Purchase not found with ID: ${purchaseId}`);
        }
        console.log('✅ Purchase data found');

        // Fetch user data
        console.log('🔍 Fetching user data...');
        const userData = await User.findById(purchaseData.userId);
        if (!userData) {
          throw new Error(`User not found with ID: ${purchaseData.userId}`);
        }
        console.log(`✅ User found: ${userData.name}`);        // Fetch course data
        console.log('🔍 Fetching course data...');
        const courseData = await Course.findById(purchaseData.courseId.toString());
        if (!courseData) {
          throw new Error(`Course not found with ID: ${purchaseData.courseId}`);
        }
        console.log(`✅ Course found: ${courseData.courseTitle}`);

        // Check if user is already enrolled
        const isAlreadyEnrolled = userData.enrolledCourses.some(courseId => 
          courseId.toString() === courseData._id.toString()
        );

        if (isAlreadyEnrolled) {
          console.log('⚠️ User is already enrolled in this course');
        } else {
          // Add user to course enrollment
          console.log('📚 Adding user to course enrollment...');
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
          console.log('✅ User added to course enrolled students');

          // Add course to user enrollment
          console.log('🎓 Adding course to user enrollment...');
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
          console.log('✅ Course added to user enrolled courses');
        }

        // Update purchase status
        console.log('💾 Updating purchase status...');
        purchaseData.status = 'completed';
        await purchaseData.save();
        console.log('✅ Purchase status updated to completed');

        console.log('🎉 Payment processing completed successfully!');

      } catch (error) {
        console.error('❌ Error processing successful payment:', error.message);
        console.error('Stack trace:', error.stack);
        return response.status(500).json({ 
          received: false, 
          error: 'Failed to process successful payment',
          details: error.message 
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      try {
        console.log('💸 Processing failed payment...');
        
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        console.log(`ℹ️ Failed Payment Intent ID: ${paymentIntentId}`);

        // Getting Session Metadata
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessions.data || sessions.data.length === 0) {
          throw new Error('No checkout session found for this failed payment');
        }

        const { purchaseId } = sessions.data[0].metadata;
        if (!purchaseId) {
          throw new Error('No purchaseId found in session metadata for failed payment');
        }

        console.log(`ℹ️ Failed Purchase ID: ${purchaseId}`);

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          throw new Error(`Purchase not found with ID: ${purchaseId}`);
        }

        purchaseData.status = 'failed';
        await purchaseData.save();
        
        console.log('✅ Failed payment processed - purchase status updated');

      } catch (error) {
        console.error('❌ Error processing failed payment:', error.message);
        return response.status(500).json({ 
          received: false, 
          error: 'Failed to process failed payment',
          details: error.message 
        });
      }
      break;
    }

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  console.log('✅ Webhook processed successfully');
  response.json({ received: true });
}