'use client';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function ProdVideos({ data }) {
    const videos = Array.isArray(data?.videos) ? data.videos : [];
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [ended, setEnded] = useState(false);
    const videoRef = useRef(null);

    // Reset state when the user navigates between products.
    useEffect(() => {
        setIdx(0);
        setPlaying(false);
        setEnded(false);
    }, [data?.id]);

    if (!videos.length) return null;

    const current = videos[idx];
    const hasMore = idx < videos.length - 1;

    const play = async () => {
        const el = videoRef.current;
        if (!el) return;
        try {
            await el.play();
            setPlaying(true);
            setEnded(false);
        } catch {
            // Autoplay can fail if the browser blocks it — keep poster visible so the user retries.
            setPlaying(false);
        }
    };

    const onEnded = () => {
        if (hasMore) {
            const nextIdx = idx + 1;
            setIdx(nextIdx);
            // Give the new <video> a tick to mount before we attempt play.
            setTimeout(() => {
                const el = videoRef.current;
                if (el) el.play().catch(() => setPlaying(false));
            }, 0);
        } else {
            setPlaying(false);
            setEnded(true);
        }
    };

    const replayAll = () => {
        setIdx(0);
        setEnded(false);
        setTimeout(() => {
            const el = videoRef.current;
            if (el) {
                el.currentTime = 0;
                el.play().catch(() => setPlaying(false));
            }
        }, 0);
    };

    const jumpTo = (i) => {
        setIdx(i);
        setEnded(false);
        setTimeout(() => {
            const el = videoRef.current;
            if (el) el.play().catch(() => setPlaying(false));
        }, 0);
    };

    return (
        <MainBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
        >
            <VideoFrame>
                <Video
                    key={current.url}
                    ref={videoRef}
                    src={`${current.url}#t=0.5`}
                    preload="metadata"
                    playsInline
                    controls={playing}
                    onEnded={onEnded}
                    onPause={() => setPlaying(false)}
                    onPlay={() => setPlaying(true)}
                />

                {!playing && !ended && (
                    <PlayOverlay onClick={play} aria-label="Reproduzir vídeo">
                        <PlayCircle>
                            <PlayIcon viewBox="0 0 24 24" aria-hidden>
                                <polygon points="7,4 21,12 7,20" />
                            </PlayIcon>
                        </PlayCircle>
                        {videos.length > 1 && (
                            <OverlayLabel>
                                {videos.length} vídeos · clica para começar
                            </OverlayLabel>
                        )}
                    </PlayOverlay>
                )}

                {ended && (
                    <EndOverlay>
                        <ReplayBtn onClick={replayAll}>↻ Ver de novo</ReplayBtn>
                    </EndOverlay>
                )}
            </VideoFrame>

            {videos.length > 1 && (
                <Queue>
                    {videos.map((v, i) => (
                        <QueueItem
                            key={v.id ?? v.url}
                            $active={i === idx}
                            onClick={() => jumpTo(i)}
                        >
                            <QueueNum>{i + 1}</QueueNum>
                            <QueueLabel>Vídeo {i + 1}</QueueLabel>
                        </QueueItem>
                    ))}
                </Queue>
            )}
        </MainBox>
    );
}

const MainBox = styled(motion.div)`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 0 96px 0;
    background: #f0f0eb;
`;

const VideoFrame = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;
`;

const Video = styled.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
`;

const PlayOverlay = styled.button`
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,94,129,0.05) 0%, rgba(0,94,129,0.45) 100%);
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    color: #fff;
    font-family: inherit;
    transition: background 0.2s;

    &:hover {
        background: linear-gradient(180deg, rgba(0,94,129,0.1) 0%, rgba(0,94,129,0.55) 100%);
    }
`;

const PlayCircle = styled.div`
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    transition: transform 0.15s;

    ${PlayOverlay}:hover & {
        transform: scale(1.05);
    }
`;

const PlayIcon = styled.svg`
    width: 64px;
    height: 64px;
    fill: #005E81;
    margin-left: 8px; /* visual centring of the triangle */
`;

const OverlayLabel = styled.div`
    font-size: 28px;
    font-weight: 600;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
`;

const EndOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ReplayBtn = styled.button`
    padding: 18px 36px;
    border-radius: 1000px;
    background: #fff;
    color: #005E81;
    border: none;
    font-family: inherit;
    font-size: 28px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);

    &:hover { background: #f0f8fb; }
`;

const Queue = styled.div`
    display: flex;
    gap: 12px;
    padding: 24px 44px 0 44px;
    flex-wrap: wrap;
`;

const QueueItem = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    border-radius: 1000px;
    border: 2px solid ${(p) => (p.$active ? '#005E81' : '#cdd9de')};
    background: ${(p) => (p.$active ? '#005E81' : '#fff')};
    color: ${(p) => (p.$active ? '#fff' : '#005E81')};
    font-family: inherit;
    font-weight: 600;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;

    &:hover {
        border-color: #005E81;
    }
`;

const QueueNum = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(p) => 'rgba(0,0,0,0.06)'};
    color: inherit;
    font-weight: 700;
    font-size: 18px;

    ${QueueItem}[data-active='true'] & {
        background: rgba(255,255,255,0.2);
    }
`;

const QueueLabel = styled.span``;
