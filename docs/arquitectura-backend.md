IDA – HTTP Petición (JSON)                 REGRESO – HTTP Respuesta (JSON)
------------------------------------      ------------------------------------
[ React (View) ]                           [ MySQL Database ]
        ↓  HTTP / JSON                             ↑  SQL Result
[ Routes ]                                 [ Services (Model) ]
        ↓                                          ↑
[ Middlewares ]                            [ Controllers ]
        ↓                                          ↑
[ Controllers ]                            [ Middlewares ]
        ↓                                          ↑
[ Services (Model) ]                       [ Routes ]
        ↓                                          ↑  JSON
[ MySQL Database ]                         [ React (View) ]



EJMPLO LOGIN
POST /api/auth/login
→ routes/auth.routes.js
→ middlewares (validación)
→ controllers/auth.controller.js
→ services/auth.service.js
→ MySQL
→ JSON response


uncios que dan respuestas al front, middleware o controller