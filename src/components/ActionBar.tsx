import React, { useRef, useEffect, useCallback } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

const zzz = styled.div``;

/**
 * Global reset & basic page styling
 */
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

  &:hover,
  &.active {
    box-shadow: 0 0 6px 1px rgb(253, 255, 173);
  }

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
    background-image: conic-gradient(rgba(0, 0, 0, 0), rgb(214, 200, 78), rgba(0, 0, 0, 0) 25%);
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
    background-image: conic-gradient(rgba(0, 0, 0, 0), rgb(214, 200, 78), rgba(0, 0, 0, 0) 25%);
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
`;

const Contents = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;

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
  z-index: 2;
`;

const KeyDiv = styled.div`
  font:
    700 1.5rem 'Roboto Condensed',
    sans-serif;
  left: 7px;
  position: absolute;
  color: rgb(214, 200, 78);
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.5),
    1px -1px 0 rgba(0, 0, 0, 0.5),
    -1px 1px 0 rgba(0, 0, 0, 0.5),
    1px 1px 0 rgba(0, 0, 0, 0.5);
  top: 2px;
  z-index: 3;
`;

/**
 * A small helper type to keep track of each action’s data.
 */
type ActionData = {
  keybind: string;
  src: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCooling: boolean;
  timerId: number | null;
  timerStart: number;
};

const ActionBar = ({ actions, onUse }: any) => {
  /**
   * Fixed cooldown of 1500 ms. No config UI anymore.
   */
  const FIXED_COOLDOWN = 1500;

  /**
   * Store each action’s data in a ref so we can mutate it.
   */
  const actionsRef = useRef<ActionData[]>(actions);

  /**
   * Ends the cooldown for a single action
   */
  const endCooldown = useCallback((action: ActionData) => {
    action.isCooling = false;

    const canvas = action.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Brief flash effect
    ctx.fillStyle = 'rgba(253, 255, 173, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 20);

    // Clear the timer
    if (action.timerId) {
      window.clearTimeout(action.timerId);
      action.timerId = null;
    }
  }, []);

  /**
   * Start cooldown for a single action
   */
  const initiateCooldown = useCallback(
    (action: ActionData) => {
      action.isCooling = true;
      action.timerStart = Date.now();
      action.timerId = window.setTimeout(() => {
        endCooldown(action);
      }, FIXED_COOLDOWN);
    },
    [FIXED_COOLDOWN, endCooldown]
  );

  /**
   * Trigger cooldown if not already cooling
   */
  const gaugeCooldown = useCallback(
    (action: ActionData) => {
      if (action.isCooling) return false;
      initiateCooldown(action);
      return true;
    },
    [initiateCooldown]
  );

  /**
   * Draw the "pie" cooldown on the canvas each animation frame
   */
  const drawCooldown = useCallback(
    (action: ActionData) => {
      if (!action.isCooling) return;
      const canvas = action.canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const elapsed = Date.now() - action.timerStart;
      const fraction = elapsed / FIXED_COOLDOWN;
      const degrees = 360 * fraction;

      // Re-size canvas to fully cover the element's bounding box
      const parent = canvas.parentElement?.parentElement; // .action
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const hypot = Math.sqrt(w * w + h * h);

      // Clear + set transform
      canvas.width = hypot;
      canvas.height = hypot;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center over parent
      canvas.style.marginLeft = -hypot / 2 + 'px';
      canvas.style.marginTop = -hypot / 2 + 'px';

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.translate(hypot / 2, hypot / 2);
      ctx.rotate(-Math.PI / 2);

      // Draw wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((hypot / 2) * Math.cos(0), (hypot / 2) * Math.sin(0));
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Stroke the "hand" at `degrees`
      ctx.moveTo(0, 0);
      ctx.lineTo((hypot / 2) * Math.cos((degrees * Math.PI) / 180), (hypot / 2) * Math.sin((degrees * Math.PI) / 180));
      ctx.stroke();

      ctx.shadowColor = '';
      ctx.shadowBlur = 0;

      // Fill remainder from degrees to 360
      ctx.arc(0, 0, hypot / 2, (degrees * Math.PI) / 180, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    },
    [FIXED_COOLDOWN]
  );

  /**
   * Animation + Keydown Effects
   */
  useEffect(() => {
    let animationId: number;

    // Continuously animate any actions that are cooling down
    const animate = () => {
      actionsRef.current.forEach((action) => {
        if (action.isCooling) {
          drawCooldown(action);
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    // Keydown listener for "1", "2", etc.
    const handleKeyDown = (e: KeyboardEvent) => {
      const hotKey = String.fromCharCode(e.keyCode);
      actionsRef.current.forEach((action) => {
        if (action.keybind === hotKey) {
          // Flash the .active CSS
          const parent = action.canvasRef.current?.closest('.action');
          if (parent) {
            parent.classList.add('active');
            setTimeout(() => parent.classList.remove('active'), 100);
          }
          gaugeCooldown(action);
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawCooldown, gaugeCooldown]);

  return (
    <div
      css={css`
        .swiper-pagination {
          top: revert !important;
          bottom: 0 !important;
        }

        .swiper-pagination-bullet {
          background: #bc955f;
        }
      `}>
      <GlobalStyles />
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={5}
        slidesPerGroup={5}
        spaceBetween={0}
        pagination={{ clickable: true }}
        style={{ padding: '10px 0 20px' }}>
        {actionsRef.current.map((action: any) => (
          <SwiperSlide key={action.id} style={{ width: 75, height: 75 }}>
            <ActionWrapper
              key={action.keybind}
              className="action"
              data-keybind={action.keybind}
              onClick={() => {
                if (gaugeCooldown(action)) {
                  onUse(action.id);
                }
              }}>
              <KeyDiv>{action.keybind}</KeyDiv>
              <GlowContainer>
                <AnimatedBorderBoxGlow />
                <AnimatedBorderBox></AnimatedBorderBox>
              </GlowContainer>
              <ActionInternal>
                <ActionOverflow>
                  <Contents>
                    <img src={action.src} alt="" />
                  </Contents>
                  <CanvasStatus ref={action.canvasRef} className="status" />
                </ActionOverflow>
              </ActionInternal>
            </ActionWrapper>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ActionBar;
