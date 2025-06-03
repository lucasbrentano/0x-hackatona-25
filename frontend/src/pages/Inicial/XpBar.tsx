import StarPrint from './../../svg/star-alt-2-svgrepo-com.svg';
import React, { useEffect, useRef, useState } from 'react';
import { calcLevelUp, calcMaxXp } from './../../CalcLevelUp';

interface XpBarProps {
    xp: number;
    level: number;
}

const XpBar = ({ xp, level }: XpBarProps) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const xpBarSize = calcMaxXp(level);
    
    useEffect(() => {
        // Reset animation
        setAnimatedWidth(0);
        
        // Animate to target value
        const timer = setTimeout(() => {
            const percentage = (xp / xpBarSize) * 100;
            setAnimatedWidth(percentage);
        }, 100);
        
        return () => clearTimeout(timer);
    }, [xp, xpBarSize]);

    // Detect if mobile/tablet for responsive styling
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'row' as const,
            width: '100%',
            alignItems: 'center',
            margin: '0 auto',
        },
        circleContainer: {
            backgroundColor: 'transparent',
            borderRadius: '35px',
            width: '65px',
            height: '65px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            position: 'relative' as const,
        },
        pawContainer: {
            marginRight: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        levelTextIos: {
            position: 'absolute' as const,
            top: '50%',
            left: '40%',
            fontFamily: 'Courier, monospace',
            fontSize: '14px',
            fontWeight: 'bold' as const,
            color: '#5b5b5b',
        },
        levelTextAndroid: {
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            fontFamily: 'Courier, monospace',
            transform: 'translate(-50%, -50%)',
            fontSize: '14px',
            fontWeight: 'bold' as const,
            color: '#5b5b5b',
        },
        text: {
            fontSize: '16px',
            fontWeight: 'bold' as const,
            marginBottom: '5px',
            alignSelf: 'flex-end' as const,
            color: '#5B5B5B',
        },
        bar: {
            width: '81%',
        },
        barBackground: {
            width: '100%',
            height: '20px',
            backgroundColor: '#ddd',
            borderRadius: '10px',
            overflow: 'hidden' as const,
        },
        barFill: {
            height: '100%',
            backgroundColor: '#80BEE7',
            width: `${animatedWidth}%`,
            transition: 'width 0.5s ease-out',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.circleContainer}>
                <div style={styles.pawContainer}>
                    {/* <StarPrint size='60' color="#5b5b5b" />*/}
                    <span
                        style={
                            isMobile
                                ? styles.levelTextAndroid
                                : styles.levelTextIos
                        }
                    >
                        {level}
                    </span>
                </div>
            </div>
            <div style={styles.bar}>
                <span style={styles.text}>
                    {xp}/{xpBarSize}
                </span>
                <div style={styles.barBackground}>
                    <div style={styles.barFill} />
                </div>
            </div>
        </div>
    );
};

export default XpBar;