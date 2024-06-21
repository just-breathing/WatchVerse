"use client"
import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { useSearchParams } from 'next/navigation'

const VideoPlayer = () => {
    const params = useSearchParams()
    const key = params.get('key');
    const videoRef = useRef<HTMLVideoElement>(null);

        const appnedSrc = (src: string) => {
            const video = videoRef.current;
            console.log(Hls.isSupported(),video)
            if (Hls.isSupported() && video) {
                video.style.width = '80vw';
                video.style.height = '80vh';
                video.style.position = 'absolute';
                video.style.top = '70px';
                video.style.left = '0';
                video.style.zIndex = '-1';  
                video.style.objectFit = 'contain';
                video.style.objectPosition = 'center ';
                video.style.transform= 'scale(1,1)';
                video.style.margin = '10px 10px';
                console.log("HLS is supported");
                    console.log(src);
                    const hls = new Hls();
                    hls.attachMedia(video);
                    hls.loadSource(src);
                    hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        console.log("playing video");
                         video.play();
                    });
            } else {
                console.log('HLS is not supported');
                // Play from the original video file
            }
        }

        useEffect(() => {
            fetch(`http://nginx:85/watch/?key=${key}`)
              .then((res) => res.json())
              .then((resJson) => {
                appnedSrc(resJson.url);
              });
          }, []);


   return <video ref={videoRef}  autoPlay controls />;
};

export default VideoPlayer;
