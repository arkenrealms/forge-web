import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const GlobalStyles = createGlobalStyle`

`;

/**
 * Actions layout
 * (We removed the panel, so only the actions remain.)
 */
const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

/**
 * Outer container for each action, as before.
 */
const ActionWrapper = styled.div`
  border-radius: 7px;
  cursor: pointer;
  margin: 0;
  outline: 0;
  position: relative;
  transition: 100ms;
  overflow: hidden;
  width: 75px;
  height: 75px;

  //   &:hover,
  //   &.active {
  //     box-shadow: 0 0 6px 1px rgb(253, 255, 173);
  //   }

  &:after {
    bottom: 0;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }
`;

/**
 * New styled components to reproduce
 * the "rotating glow" effect around each box.
 */

/**
 * 1) A parent container that positions the glow layers absolutely
 *    so they appear behind the action content.
 */
const GlowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/**
 * 2) The "glow" layer (blurred)
 */
const AnimatedBorderBoxGlow = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 0;
  filter: blur(5px);
  height: 100%;
  width: 100%;
  border-radius: 3px;

  &::after {
    content: '';
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(180deg);
    position: absolute;
    width: 99999px;
    height: 99999px;
    background: #333;
    background-repeat: no-repeat;
    background-position: 0 0;
    /* Middle color: #1976ed */
    background-image: conic-gradient(rgba(0, 0, 0, 0), rgb(214, 200, 78), rgba(0, 0, 0, 0) 25%);
    /* Speed of rotation */
    animation: rotate2 5s linear infinite;
    opacity: 0.5;
  }

  &::before {
    content: '';
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    position: absolute;
    width: 99999px;
    height: 99999px;
    background: #333;
    background-repeat: no-repeat;
    background-position: 0 0;
    /* Middle color: #1976ed */
    background-image: conic-gradient(rgba(0, 0, 0, 0), rgb(214, 200, 78), rgba(0, 0, 0, 0) 25%);
    /* Speed of rotation */
    animation: rotate 5s linear infinite;
    opacity: 0.5;
  }
`;

/**
 * 3) The main "border box" in front of the glow.
 *    Contains the conic gradient border + an inner box background (#292a2e).
 */
const AnimatedBorderBox = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 0;
  height: 100%;
  width: 100%;
  border-radius: 7px;
  background: #000;
  filter: saturate(7);

  &::after {
    content: '';
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(180deg);
    position: absolute;
    width: 99999px;
    height: 99999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(rgba(0, 0, 0, 0), rgb(235, 229, 107), rgba(0, 0, 0, 0) 40%);
    animation: rotate2 5s linear infinite;
  }

  &::before {
    content: '';
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    position: absolute;
    width: 99999px;
    height: 99999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(rgba(0, 0, 0, 0), rgb(235, 229, 107), rgba(0, 0, 0, 0) 40%);
    animation: rotate 5s linear infinite;
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(1turn);
    }
  }

  @keyframes rotate2 {
    0% {
      /* Also begin at 180deg */
      transform: translate(-50%, -50%) rotate(180deg);
    }
    100% {
      /* 180deg + 360deg = 540deg total */
      transform: translate(-50%, -50%) rotate(540deg);
    }
  }
`;

/**
 * The actual "inside" of our action: the image + the cooldown canvas.
 * We'll nest this inside the glow/border container.
 */
const ActionInternal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2px;
  /* We leave background transparent so the box behind it is visible. */
`;

const ActionOverflow = styled.div`
  position: relative;
  border-radius: 7px;
  overflow: hidden;
  height: 100%;
`;

const Contents = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
  background: #000;

  img {
    display: block;
    margin: 0;
    height: 100%;
    width: 100%;
  }
`;

const CanvasStatus = styled.canvas`
  left: 50%;
  position: absolute;
  top: 50%;
  z-index: 3;
`;

const CanvasStatus2 = styled.canvas`
  left: 50%;
  position: absolute;
  top: 50%;
  z-index: 2;
`;

const KeyDiv = styled.div`
  font:
    700 1rem 'Roboto Condensed',
    sans-serif;
  top: 3px;
  left: 7px;
  position: absolute;
  color: rgb(214, 200, 78);
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.5),
    1px -1px 0 rgba(0, 0, 0, 0.5),
    -1px 1px 0 rgba(0, 0, 0, 0.5),
    1px 1px 0 rgba(0, 0, 0, 0.5);
  z-index: 3;
`;

const CountdownDiv = styled.div`
  font:
    700 0.9rem 'Roboto Condensed',
    sans-serif;
  bottom: 3px;
  left: 0;
  position: absolute;
  color: rgb(214, 200, 78);
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.5),
    1px -1px 0 rgba(0, 0, 0, 0.5),
    -1px 1px 0 rgba(0, 0, 0, 0.5),
    1px 1px 0 rgba(0, 0, 0, 0.5);
  z-index: 3;
  text-align: center;
  width: 100%;
`;
const CountdownDivWithRef = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <CountdownDiv ref={ref} {...props} />
));
// ... other styled components, same as before ...

type ActionData = {
  id: string;
  keybind: string;
  src: string;
  name: string;
  description: string;
  isSelf: boolean;
  isActive: boolean;
  isToggled: boolean;
  isCooling: boolean;
  isGlobalCooling: boolean;
  holdTimeout: number | null;
  countdownRef: React.RefObject<HTMLDivElement>;
  cooldown: number;
  cooldownRef: React.RefObject<HTMLCanvasElement>;
  cooldownTimerId: number | null;
  cooldownTimerStart: number;
  globalCooldown: number;
  globalCooldownRef: React.RefObject<HTMLCanvasElement>;
  globalCooldownTimerId: number | null;
  globalCooldownTimerStart: number;
};

interface ActionBarProps {
  actions: {
    id: string;
    keybind: string;
    name?: string;
    description?: string;
    src: string;
    isSelf?: boolean;
    isActive?: boolean;
    isToggled?: boolean;
    cooldown?: number;
    globalCooldown?: number;
  }[];
  onUse: (id: string) => void;
  onToggle?: (id: string, newState: boolean) => void;
}

// Minimum item count
const MIN_ITEMS = 25;
const MAX_ITEMS = 25;

// We'll create a function that pads the existing array
// with placeholder items until it has 25.
function fillActionsToMin(items, minCount) {
  const newItems = [...items];

  // While our array is shorter than minCount, push a new item
  while (newItems.length < minCount) {
    const idx = newItems.length; // index of the new item

    newItems.push({
      id: `auto-generated-action-${idx}`,
      keybind: String(idx), // or something more interesting
    });
  }

  return newItems.slice(0, MAX_ITEMS);
}

const ActionBar: React.FC<ActionBarProps> = ({ actions, onUse, onToggle }) => {
  const filledActions = fillActionsToMin(actions, MIN_ITEMS);

  const [cacheKey, setCacheKey] = useState('cache');
  const actionsRef = useRef<ActionData[]>(
    filledActions.map((a) => ({
      ...a,
      isSelf: a.isSelf ?? false,
      isActive: a.isActive ?? false,
      isToggled: a.isToggled ?? false,
      isCooling: false,
      isGlobalCooling: false,
      holdTimeout: null,
      cooldown: a.cooldown ?? 0,
      cooldownRef: React.createRef<HTMLCanvasElement>(),
      countdownRef: React.createRef<HTMLDivElement>(),
      cooldownTimerId: null,
      cooldownTimerStart: 0,
      globalCooldown: a.globalCooldown ?? 1,
      globalCooldownRef: React.createRef<HTMLCanvasElement>(),
      globalCooldownTimerId: null,
      globalCooldownTimerStart: 0,
    }))
  );

  const endGlobalCooldown = useCallback((action: ActionData) => {
    action.isGlobalCooling = false;
    if (action.globalCooldownTimerId) {
      clearTimeout(action.globalCooldownTimerId);
      action.globalCooldownTimerId = null;
    }
    const canvas = action.globalCooldownRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(253, 255, 173, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 20);
  }, []);

  const initiateGlobalCooldown = useCallback(
    (action: ActionData) => {
      if (action.globalCooldown === 0) return;
      action.isGlobalCooling = true;
      action.globalCooldownTimerStart = Date.now();
      action.globalCooldownTimerId = window.setTimeout(() => endGlobalCooldown(action), action.globalCooldown * 1000);
    },
    [endGlobalCooldown]
  );

  const gaugeGlobalCooldown = useCallback(
    (action: ActionData) => {
      if (action.globalCooldown === 0) return true;
      if (action.isGlobalCooling) return false;

      return true;
    },
    [initiateGlobalCooldown]
  );

  const drawGlobalCooldown = useCallback((action: ActionData) => {
    if (action.globalCooldown === 0) return;
    if (!action.isGlobalCooling) return;

    const canvas = action.globalCooldownRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = Date.now() - action.globalCooldownTimerStart;
    const fraction = elapsed / (action.globalCooldown * 1000);
    const degrees = 360 * fraction;

    const parent = canvas.parentElement?.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const hypot = Math.sqrt(w * w + h * h);

    canvas.width = hypot;
    canvas.height = hypot;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.marginLeft = -hypot / 2 + 'px';
    canvas.style.marginTop = -hypot / 2 + 'px';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.translate(hypot / 2, hypot / 2);
    ctx.rotate(-Math.PI / 2);

    ctx.beginPath();
    //   ctx.moveTo(0, 0);
    //   ctx.lineTo((hypot / 2) * Math.cos(0), (hypot / 2) * Math.sin(0));
    //   ctx.lineWidth = 0;
    //   ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    //   ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    //   ctx.shadowBlur = 10;
    //   ctx.stroke();

    ctx.moveTo(0, 0);
    ctx.lineTo((hypot / 2) * Math.cos((degrees * Math.PI) / 180), (hypot / 2) * Math.sin((degrees * Math.PI) / 180));
    //   ctx.stroke();

    ctx.shadowColor = '';
    ctx.shadowBlur = 0;

    ctx.arc(0, 0, hypot / 2, (degrees * Math.PI) / 180, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }, []);

  const updateCountdown = (action: ActionData) => {
    if (!action.isCooling) return;

    const countdownElement = action.countdownRef?.current;
    if (!countdownElement) return;

    const update = () => {
      if (!action.isCooling) return;
      const elapsed = (Date.now() - action.cooldownTimerStart) / 1000;
      const remaining = Number(Math.max(0, action.cooldown - elapsed).toFixed(2)); // Convert to number
      countdownElement.textContent = remaining + '';

      if (remaining > 0) {
        requestAnimationFrame(update);
      } else {
        countdownElement.textContent = ''; // Clear when finished
      }
    };

    requestAnimationFrame(update);
  };

  const endCooldown = useCallback((action: ActionData) => {
    action.isCooling = false;
    action.isActive = false;
    if (action.cooldownTimerId) {
      clearTimeout(action.cooldownTimerId);
      action.cooldownTimerId = null;
    }

    const countdownElement = action.countdownRef?.current;
    if (countdownElement) {
      countdownElement.textContent = ''; // Reset text
    }
  }, []);

  const initiateCooldown = useCallback(
    (action: ActionData) => {
      if (action.cooldown === 0) return;
      action.isCooling = true;
      action.cooldownTimerStart = Date.now();
      action.cooldownTimerId = window.setTimeout(() => endCooldown(action), action.cooldown * 1000);

      // Start countdown update
      updateCountdown(action);
    },
    [endCooldown]
  );

  const gaugeCooldown = useCallback(
    (action: ActionData) => {
      if (action.cooldown === 0) return true;
      if (action.isCooling) return false;

      action.isActive = true;

      return true;
    },
    [initiateCooldown]
  );

  const drawCooldown = useCallback((action: ActionData) => {
    if (action.cooldown === 0) return;
    if (!action.isCooling) return;

    const canvas = action.cooldownRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = Date.now() - action.cooldownTimerStart;
    const fraction = elapsed / (action.cooldown * 1000);
    const degrees = 360 * fraction;

    const parent = canvas.parentElement?.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const hypot = Math.sqrt(w * w + h * h);

    canvas.width = hypot;
    canvas.height = hypot;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.marginLeft = -hypot / 2 + 'px';
    canvas.style.marginTop = -hypot / 2 + 'px';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.translate(hypot / 2, hypot / 2);
    ctx.rotate(-Math.PI / 2);

    ctx.beginPath();
    //   ctx.moveTo(0, 0);
    //   ctx.lineTo((hypot / 2) * Math.cos(0), (hypot / 2) * Math.sin(0));
    //   ctx.lineWidth = 0;
    //   ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    //   ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    //   ctx.shadowBlur = 10;
    //   ctx.stroke();

    ctx.moveTo(0, 0);
    ctx.lineTo((hypot / 2) * Math.cos((degrees * Math.PI) / 180), (hypot / 2) * Math.sin((degrees * Math.PI) / 180));
    //   ctx.stroke();

    ctx.shadowColor = '';
    ctx.shadowBlur = 0;

    ctx.arc(0, 0, hypot / 2, (degrees * Math.PI) / 180, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }, []);

  // Animate cooldown
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      actionsRef.current.forEach((action) => {
        if (action.isCooling) {
          drawGlobalCooldown(action);
          drawCooldown(action);
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    // const handleKeyDown = (e: KeyboardEvent) => {
    //   if (!focusedContainerRef.current?.contains(document.activeElement)) {
    //     return; // Ignore if not inside the focused div
    //   }

    //   const hotKey = String.fromCharCode(e.keyCode);
    //   actionsRef.current.forEach((action) => {
    //     if (action.keybind === hotKey) {
    //       // short-click
    //       const parent = action.cooldownRef.current?.closest('.action');
    //       if (parent) {
    //         parent.classList.add('active');
    //         setTimeout(() => parent.classList.remove('active'), 100);
    //       }
    //       if (gaugeCooldown(action) && gaugeGlobalCooldown(action)) {
    //         initiateGlobalCooldown(action);
    //         initiateCooldown(action);
    //         onUse(action.id);
    //       }
    //     }
    //   });
    // };

    // document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationId);
      // document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawGlobalCooldown, gaugeGlobalCooldown, drawCooldown, gaugeCooldown, onUse]);

  /**
   * LONG PRESS via Pointer Events
   */
  const handlePointerDown = useCallback(
    (action: ActionData, e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      action.holdTimeout = window.setTimeout(() => {
        action.isToggled = !action.isToggled;
        onToggle?.(action.id, action.isToggled);
        action.holdTimeout = null;
        setCacheKey('cache' + Math.random());
      }, 500);
    },
    [onToggle, setCacheKey]
  );

  const handlePointerUp = useCallback(
    (action: ActionData) => {
      if (action.holdTimeout) {
        clearTimeout(action.holdTimeout);
        action.holdTimeout = null;
        // short-click
        if (gaugeCooldown(action) && gaugeGlobalCooldown(action)) {
          initiateGlobalCooldown(action);
          initiateCooldown(action);
          onUse(action.id);
        }
      }
    },
    [gaugeGlobalCooldown, gaugeCooldown, onUse]
  );

  const handlePointerCancel = useCallback((action: ActionData) => {
    // If pointer is canceled mid-press, kill the hold
    if (action.holdTimeout) {
      clearTimeout(action.holdTimeout);
      action.holdTimeout = null;
    }
  }, []);

  return (
    <div
      css={css`
        .swiper {
          filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.7));
        }
        .swiper-wrapper {
          margin-bottom: 15px;
        }
        .swiper-pagination {
          margin-top: 20px;
        }
        .swiper-pagination-bullet-active {
          background: #bc955f !important;
        }
        img {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}>
      <GlobalStyles />
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={5}
        slidesPerGroup={5}
        spaceBetween={0}
        pagination={{ clickable: true }}
        style={{ padding: '10px 0 20px' }}
        noSwiping={true}
        noSwipingClass="swiper-no-swiping">
        {actionsRef.current.map((action) => (
          <SwiperSlide key={action.id} style={{ width: 75, height: 75 }}>
            <ActionWrapper
              className="action swiper-no-swiping"
              onPointerDown={(e) => handlePointerDown(action, e)}
              onPointerUp={() => handlePointerUp(action)}
              onPointerCancel={() => handlePointerCancel(action)}
              onContextMenu={(e) => e.preventDefault()}>
              {action.isSelf ? <KeyDiv>SELF</KeyDiv> : null}
              {action.cooldown ? <CountdownDivWithRef ref={action.countdownRef}></CountdownDivWithRef> : null}
              {/* <KeyDiv>{action.keybind}</KeyDiv> */}
              {action.isToggled && (
                <GlowContainer>
                  <AnimatedBorderBox />
                  <AnimatedBorderBoxGlow />
                </GlowContainer>
              )}
              <ActionInternal>
                <ActionOverflow>
                  <Contents>{action.src ? <img src={action.src} alt="" /> : null}</Contents>
                  <CanvasStatus2 ref={action.globalCooldownRef} className="status" />
                  <CanvasStatus ref={action.cooldownRef} className="countdown" />
                </ActionOverflow>
              </ActionInternal>
            </ActionWrapper>
          </SwiperSlide>
        ))}
      </Swiper>
      <div style={{ display: 'none' }}>{cacheKey}</div>
    </div>
  );
};

export default ActionBar;
