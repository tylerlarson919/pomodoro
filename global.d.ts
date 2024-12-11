// global.d.ts
declare global {
    interface Window {
      timerInterval: NodeJS.Timeout | undefined; // You can adjust the type based on your usage
    }
  }
  
  // This line is necessary to make the file a module.
  export {};
  