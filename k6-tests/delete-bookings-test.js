import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const bookingId = '575be852-1463-4c9c-b6d0-8321f84a861a';
  const url = `http://localhost:3000/bookings/${bookingId}`;

  const res = http.del(url);

  check(res, {
    'status is 204': (r) => r.status === 204,
    'response time is < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
