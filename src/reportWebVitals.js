//Function to report web performance metrics (web vitals)
const reportWebVitals = onPerfEntry => {
  // Only proceed if a valid callback function is provided
  if (onPerfEntry && onPerfEntry instanceof Function) {
    v// Dynamically import the web-vitals library (code-splitting)
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

export default reportWebVitals;
