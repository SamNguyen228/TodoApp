export const bgImage = (): string => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const images = [
    "url('https://t3.ftcdn.net/jpg/01/91/63/46/360_F_191634678_7SLWvip1Aoh4nsrE8RD4usPWgPayEMRB.jpg')",
    "url('https://d2rqvd0kuag1qx.cloudfront.net/blog-15.jpg')",
    "url('https://extra.ie/wp-content/uploads/2025/05/Sun_1.jpg?w=1200')",
    "url('https://img.freepik.com/free-photo/beautiful-shining-stars-night-sky_181624-622.jpg?semt=ais_incoming&w=740&q=80')",
    "url('https://images.unsplash.com/photo-1611928482473-7b27d24eab80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWR5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D')",
    "url('https://www.timeforkids.com/wp-content/uploads/2018/08/Storms-Images.jpg')",
    "url('https://i.abcnewsfe.com/a/7f8980ec-b4c2-4ae1-b15b-e2d2e787464d/snow-rf-gty-ml-241129_1732917933880_hpMain_16x9.jpg?w=992')"
  ];

  const randomIndex = Math.floor(
    (Math.sin(minutes) * 50000) % images.length
  );
  return images[Math.abs(randomIndex)];
};
