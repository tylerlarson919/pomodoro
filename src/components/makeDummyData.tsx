import { addSession } from "../../firebase";

const generateRandomSessions = () => {
  const timerLengths = [5, 15, 20, 30, 45, 60, 90, 120];
  const timerNames = [
    "Getting ready",
    "Deep work",
    "Quick break",
    "Study session",
    "Workout",
    "Meal prep",
    "Meditation",
    "Planning",
    "Writing",
    "Brainstorming",
  ];
  const statuses = ["finished", "interrupted", "cancelled"];
  const now = Date.now();

  // Generate 20 sample sessions
  const sessions = Array.from({ length: 20 }, (_, i) => {
    const startTime = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time within the last week
    const timerLength = timerLengths[Math.floor(Math.random() * timerLengths.length)];
    const endTime = startTime + timerLength * 60 * 1000; // Convert timerLength to milliseconds
    const status = statuses[Math.random() < 0.8 ? 0 : Math.floor(Math.random() * statuses.length)]; // 80% "finished"
    const completed = status === "finished";

    return {
      sessionId: `session_${startTime}`,
      completed,
      currentTimer: false,
      endTime,
      startTime,
      status,
      timerLength,
      timerName: timerNames[Math.floor(Math.random() * timerNames.length)],
    };
  });

  return sessions;
};

const bulkAddSessions = async () => {
  const sessions = generateRandomSessions();

  try {
    for (const session of sessions) {
      await addSession(session);
      console.log(`Session ${session.sessionId} added successfully.`);
    }
    console.log("All sessions added successfully.");
  } catch (error) {
    console.error("Error adding sessions:", error);
  }
};

// Export the bulkAddSessions function
export default bulkAddSessions;
