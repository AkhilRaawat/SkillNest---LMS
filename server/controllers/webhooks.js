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
  try {
    const sig = request.headers['stripe-signature'];
    if (!sig) {
      return response.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return response.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        if (!purchaseId) {
          throw new Error('No purchaseId found in session metadata');
        }

        // Find and validate purchase
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          throw new Error('Purchase not found');
        }

        // Find and validate user
        const userData = await User.findById(purchaseData.userId);
        if (!userData) {
          throw new Error('User not found');
        }

        // Find and validate course
        const courseData = await Course.findById(purchaseData.courseId);
        if (!courseData) {
          throw new Error('Course not found');
        }

        // Check if user is already enrolled
        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        // Check if user is already in enrolled students
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        // Update purchase status
        purchaseData.status = 'completed';
        await purchaseData.save();

        console.log(`Successfully processed payment for purchase ${purchaseId}`);
        break;
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        if (purchaseId) {
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = 'failed';
            await purchaseData.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    response.status(500).json({ error: error.message });
  }
}