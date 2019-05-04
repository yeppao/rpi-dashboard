import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from '../pages/not-found';
import Home from './Home';
import Docker from '../pages/docker';
import Wlan from '../Wlan';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/docker" component={Docker} />
            <Route path="/wlan" component={Wlan} />
            <Route path="/docker/:containerId" component={Docker} />
            <Route component={NotFound} />
        </Switch>
    </BrowserRouter>
)

export default Router;