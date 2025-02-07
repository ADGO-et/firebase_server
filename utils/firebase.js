const admin = require("firebase-admin");
const serviceAccount = require("./teletemari-firebase-adminsdk-fbsvc-630e039ba8.json");

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
