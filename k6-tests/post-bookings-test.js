import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/bookings';
  const payload = JSON.stringify({
    userId: 'f3a7a2b7-e695-43d3-8946-d9214ca0cad8',
    homestayId: '90beffc7-940a-4b74-b727-f9edb3897215',
    checkInDate: '2024-08-12T10:00:00.000Z',
    checkOutDate: '2024-08-12T11:00:00.000Z',
    totalPrice: 130,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time is < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
