import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  //   vus: 100,
  //   duration: '30s',
  stages: [
    { duration: '1m', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 300 },
    { duration: '1m', target: 400 },
    { duration: '5m', target: 0 },
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/bookings');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time is < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
