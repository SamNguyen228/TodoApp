export const bgImage = (): string => {
  const hour = new Date().getHours();

  let bgImage =
    "url('https://extra.ie/wp-content/uploads/2025/05/Sun_1.jpg?w=1200')";

  if (hour >= 5 && hour < 10) {
    bgImage =
      "url('https://t3.ftcdn.net/jpg/01/91/63/46/360_F_191634678_7SLWvip1Aoh4nsrE8RD4usPWgPayEMRB.jpg')";
  } else if (hour >= 10 && hour < 16) {
    bgImage =
      "url('https://t4.ftcdn.net/jpg/03/01/23/03/360_F_301230325_XE8lPUdFbNs2eVsGYe6aqk7shBfU4iLR.jpg')";
  } else if (hour >= 16 && hour < 19) {
    bgImage =
      "url('https://extra.ie/wp-content/uploads/2025/05/Sun_1.jpg?w=1200')";
  } else {
    bgImage =
      "url('https://img.freepik.com/free-photo/beautiful-shining-stars-night-sky_181624-622.jpg?semt=ais_incoming&w=740&q=80')";
  }

  return bgImage;
};
