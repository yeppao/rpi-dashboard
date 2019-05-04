import React from 'react';
import BaseLayout from "../components/Layout/BaseLayout";
import { withRouter } from 'next/router';

const Page = () => (
    <BaseLayout>
        <div>Docker</div>
    </BaseLayout>    
);

export default withRouter(Page);