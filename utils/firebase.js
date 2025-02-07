const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID.replace(/\\n/g, "\n"),
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const createNotificationMessage = (type, details) => {
  switch (type) {
    case "QUIZ_CREATED":
      return {
        title: "New Quiz Created",
        body: `A new quiz on ${details.subject} for grade ${details.grade} has been created. Check it out!`,
      };
    case "CONTEST_CREATED":
      return {
        title: "New Contest Created",
        body: `A new contest on ${details.subject} for grade ${details.grade} has been created. Check it out!`,
      };
    default:
      return {
        title: "Notification",
        body: "You have a new notification.",
      };
  }
};

// this handler is used to store notifications in firestore db
async function storeNotification(userId, title, body) {
  await db.collection("notifications").add({
    userId,
    title,
    body,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  });
}

async function sendNotificationToIndividual(token, type, details) {
  const data = createNotificationMessage(type, details);
  const message = {
    token,
    data,
  };

  // store notifications in database
  await storeNotification(token, data.title, data.body);

  // send message
  try {
    const response = await admin.messaging().send(message);
    return { success: true, response };
  } catch (error) {
    console.log("Error sending message:", error);
    return { success: false, error };
  }
}

async function sendNotificationToGroup(tokens, type, details) {
  const data = createNotificationMessage(type, details);
  const message = {
    tokens,
    data,
  };

  // store notifications in database
  tokens.map(async (token) => {
    await storeNotification(token, data.title, data.body);
  });

  // send multicast message
  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return { success: true, response };
  } catch (error) {
    console.log("Error sending multicast message:", error);
    return { success: false, error };
  }
}

const NotificationType = Object.freeze({
  QUIZ_CREATED: "QUIZ_CREATED",
  CONTEST_CREATED: "CONTEST_CREATED",
});

module.exports = {
  sendNotificationToIndividual,
  sendNotificationToGroup,
  NotificationType,
};
