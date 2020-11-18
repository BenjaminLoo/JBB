/**
 * @format
 */

import {AppRegistry} from 'react-native';
import DataViewer from './DataViewer';
import ResultViewer from './ResultViewer'
import app from './App'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => app);
