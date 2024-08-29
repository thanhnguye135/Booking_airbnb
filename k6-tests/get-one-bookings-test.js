import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const bookingId = '1b583072-f8d4-413d-9afb-9e4356369db4';
  const url = `http://localhost:3000/bookings/${bookingId}`;

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time is < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
