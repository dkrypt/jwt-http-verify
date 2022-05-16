const request = require('supertest');
const { jwtVerifier } = require('../index');
const {router, app} = require('./test-server');

describe('JwtVerifier Tests', () => { 
  before((done) => {
    app.use(jwtVerifier({
      http: {
        url: 'http://localhost:9101/token/introspect',
        method: 'POST'
      }
    }));
    app.use('/test', router);
    done();
  });
  it('Should pass successfully, on network', (done) => {
    request(app)
      .get('/test/protected')
      .set('Authorization', `Bearer eyJraWQiOiJuaUlmclhQakZqV2lkUlNuYjJsK3VTMFFxZk9ZbW0yZ2JxWSs5STZzcE1rPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0ZmQzNjRlOS0wNDMxLTQwNDktYmNmOS0wMTE5NDdlYzU3OTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9aUUg2QjJjUGEiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxZWlyZ2ZvcDNjMDN2NjYwOWlzZTU5OTc5NiIsIm9yaWdpbl9qdGkiOiI1MjQ5NGI5Ny1mMDllLTRlMDMtYTE0Ni1jYmYyNDA4N2M5ZDMiLCJldmVudF9pZCI6IjEyYzE1MzViLTc4ZjktNGVmZi1hYmE3LTgyOWUzYWIzMDA5ZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2NTI3MDA3OTIsImV4cCI6MTY1MjcwNDM5MiwiaWF0IjoxNjUyNzAwNzkyLCJqdGkiOiIzNGJiY2FiNC1jZjdkLTQwYjAtOWNlMS1mYzcwM2NkNjljMWMiLCJ1c2VybmFtZSI6IjRmZDM2NGU5LTA0MzEtNDA0OS1iY2Y5LTAxMTk0N2VjNTc5OSJ9.n2YLRiIzljlC9GmV6QBEWBMR0OlU2lo6n_51NGOrwGpODivpkJjZ-eXARvU__lgidpBf8aPRTTZkI6kdufumxWtsD3_w7EDoVvAypZ5WN6Uu_wMzBushPQGf05gOu9jmZiEUXZ1ULrK7K0gkA-CIi9qg2_zOOGwg-kASJcIqcXwtahLkAcPBGsCm0O1mbfGFw54_mceirQ_ZBCnV7AsQ5SziX7wT1oeefLXeNK1W-jzuyUxLewmo9GhI1oj2MXrUAuuzJTVVW7U5I2E7nhH4yxo9Zox2G34HaXT52CH_IW_ByzUjSEEiWsbYhbW18VsBmOzL3qTbcErm7-a1hsucTg`)
      .expect(200, done);
  });
});
