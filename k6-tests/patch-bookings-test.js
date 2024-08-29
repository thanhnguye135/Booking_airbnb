import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const bookingId = 'ec108226-337c-49eb-85b2-1323fc8e26d5';
  const url = `http://localhost:3000/bookings/${bookingId}`;
  const payload = JSON.stringify({
    totalPrice: 199,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.patch(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time is < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
