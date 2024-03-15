import React, { useEffect, useRef } from 'react';

function AdComponent({style}) {
    const adContainer = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://ads-partners.coupang.com/g.js";
        script.onload = () => {
            new window.PartnersCoupang.G({
                "id": 762878,
                "template": "carousel",
                "trackingCode": "AF2614522",
                "width": "200",
                "height": "1500",
                "tsource": "",
                "container": adContainer.current,
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div ref={adContainer} style={style} />;
}

export default AdComponent;