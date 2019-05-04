import React from 'react';
import BaseLayout from '../components/Layout/BaseLayout';
import { withRouter } from 'next/router';

class Page extends React.Component {
    render() {
        return (
            <BaseLayout>
                <div>Not Found</div>
            </BaseLayout>
        );
    }
}

export default withRouter(Page);