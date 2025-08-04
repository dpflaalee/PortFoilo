import axios from "axios";

export const submitPassportSeal = (passportId, sealId, reviewId) =>
  axios.post('/api/passport-seals', {
    passport: { id: passportId },
    seal: { id: sealId },
    review: { id: reviewId },
  });
