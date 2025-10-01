export const bgImage = (): string => {
  const now = new Date();
  const hour = now.getHours();

  let image = "";

  if (hour >= 5 && hour < 10) {
    image = "url('https://extra.ie/wp-content/uploads/2025/05/Sun_1.jpg?w=1200')";
  } else if (hour >= 10 && hour < 14) {
    image = "url('https://d2rqvd0kuag1qx.cloudfront.net/blog-15.jpg')";
  } else if (hour >= 14 && hour < 18) {
    image = "url('https://t3.ftcdn.net/jpg/01/91/63/46/360_F_191634678_7SLWvip1Aoh4nsrE8RD4usPWgPayEMRB.jpg')";
  } else if (hour >= 18 && hour < 20) {
    image = "url('https://images.unsplash.com/photo-1611928482473-7b27d24eab80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWR5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D')";
  } else if (hour >= 20 && hour < 23) {
    image = "url('https://media.istockphoto.com/id/463416797/photo/full-moon-over-sea.jpg?s=612x612&w=0&k=20&c=yRQvzsQcbqPZWvvJDnDelLWjM-KnvNdMCqbmr6rcIdI=')";
  } else {
    image = "url('https://img.freepik.com/free-photo/beautiful-shining-stars-night-sky_181624-622.jpg?semt=ais_incoming&w=740&q=80')";
  }

  return image;
};
