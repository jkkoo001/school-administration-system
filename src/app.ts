import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import globalErrorHandler from './config/globalErrorHandler';

const App = Express();

App.use(compression());
App.use(cors());
App.use(Express.json());  //  bodyParser is deprecated, replace with Express
App.use(Express.urlencoded( { extended: true } ));  //  bodyParser is deprecated, replace with Express
App.use('/api', router);
App.use(globalErrorHandler);

export default App;
