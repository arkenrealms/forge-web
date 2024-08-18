export default {}

// import React, { useState, useContext, useRef } from "react";
// import { AppBar, Button, Toolbar, List, ListItem, Divider } from "react95";
// import { useDispatch } from "react-redux";
// import { Link as RouterLink, NavLink } from 'react-router-dom'
// import { withRouter } from "react-router-dom";
// import { useMatchBreakpoints } from '~/ui'
// import { Flex } from '~/ui'
// import styled, { css, ThemeContext } from "styled-components";
// import { useLocation } from "react-router-dom";
// import useOnclickOutside from "react-cool-onclickoutside";

// import {
//   setTheme,
//   setBackground,
//   toggleScanLines,
//   toggleMatrix,
// } from "../store/actions/user";

// const NavBar = (props) => {
//   const dispatch = useDispatch();
//   const { history, pageState, pageSort, onChangePage } = props;
//   const { push } = history;
//   const currentLocation = useLocation();
//   const theme = useContext(ThemeContext);
//   const containerRef = useRef(null);
//   //const currentLocation = props.location;
//   const [open, setOpen] = useState(false);
//   const [showTools, setShowTools] = useState(false);
//   const [showLearn, setShowLearn] = useState(false);
//   const [showPokemon, setShowPokemon] = useState(false);
//   const [showWip, setShowWip] = useState(false);
//   const [showProducts, setShowProducts] = useState(false);
//   const [showOther, setShowOther] = useState(false);

//   const [currentTime, setTime] = React.useState(
//     new Date().toLocaleString("en-US", {
//       hour: "numeric",
//       minute: "numeric",
//       hour12: true,
//     })
//   );

//   const toggleProducts = (show) => {
//     setShowPokemon(false);
//     setShowWip(false);
//     setShowOther(false);
//     setShowTools(false);
//     setShowLearn(false);
//     setShowProducts(show);
//   };

//   const toggleLearn = (show) => {
//     setShowPokemon(false);
//     setShowWip(false);
//     setShowOther(false);
//     setShowTools(false);
//     setShowProducts(false);
//     setShowLearn(show);
//   };

//   const toggleTools = (show) => {
//     setShowPokemon(false);
//     setShowWip(false);
//     setShowOther(false);
//     setShowLearn(false);
//     setShowProducts(false);
//     setShowTools(show);
//   };

//   const togglePokemon = (show) => {
//     setShowTools(false);
//     setShowWip(false);
//     setShowOther(false);
//     setShowLearn(false);
//     setShowProducts(false);
//     setShowPokemon(show);
//   };

//   const toggleWip = (show) => {
//     setShowTools(false);
//     setShowPokemon(false);
//     setShowOther(false);
//     setShowLearn(false);
//     setShowProducts(false);
//     setShowWip(show);
//   };

//   const toggleOther = (show) => {
//     setShowTools(false);
//     setShowPokemon(false);
//     setShowWip(false);
//     setShowLearn(false);
//     setShowProducts(false);
//     setShowOther(show);
//   };

//   // HANDLE MOUSE EVENTS
//   useOnclickOutside(
//     () => {
//       setOpen(false);
//       setShowTools(false);
//       setShowPokemon(false);
//       setShowWip(false);
//       setShowOther(false);
//       setShowLearn(false);
//       setShowProducts(false);
//     },
//     { refs: [containerRef] }
//   );

//   React.useEffect(() => {
//     const timer = setInterval(() => {
//       setTime(
//         new Date().toLocaleString("en-US", {
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//         })
//       );
//     }, 10000);

//     return () => clearInterval(timer);
//   }, []);

//   const currentUrl = currentLocation.pathname + currentLocation.search;

//   async function handleMenu(id: string) {
//     setOpen(false);
//     onChangePage(id);
//   }

//   const NavItem = styled(RouterLink)<{ isFocused: boolean }>`
//   font-size: 1.2rem;
//   // border-right: 2px solid #030303;
//   padding: 13px 20px 10px;
//   color: #bb955e;
//   // background-color: #222;
//   // background-image: linear-gradient(180deg,transparent 0,rgba(0,0,0,1) 50%,transparent);
//   height: 65px;
//   text-shadow: 0 0 5px #000, 00 0 10px #000, 0 0 15px #000000, 0 0 20px #000000;

//   ${({ isFocused }) => isFocused ? `
//     font-weight: bold;
//     text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000, 0 0 10px #000, 0 0 10px #000, 0 0 10px #000, 0 0 15px #000000,
//       0 0 15px #000000, 0 0 15px #000000, 0 0 20px #000000, 0 0 20px #000000, 0 0 20px #000000;
//   ` : ''}

//   &:last-child {
//     // border-right: 2px solid #030303;
//     // border-right: none;
//   }

//   &:hover {
//     filter: brightness(1.4);
//   }
// `

//   const PageComponents = () => {
//     const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
//     const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl
//     if (isMobile) return <></>

//     return pageSort.items.map((page) => (
//       <NavItem
//         key={page}
//         to={pageState[page].path}
//         isFocused={pageState[page].focused}
//         onClick={() => handleMenu(page)}
//       >
//         {/* {pageState[page].focused ? <Icon
//           src={pageState[page].icon}
//           alt="icon"
//         /> : null} */}
//         <span className="menu-text">{pageState[page].title}</span>
//       </NavItem>
//     ));
//   };

//   const isDev = process.env.NODE_ENV === "development";

//   return (
//     <SAppBar fixed ref={containerRef} style={{ pointerEvents: 'none' }}>
//       <SToolbar className="toolbar" style={{ justifyContent: "start", pointerEvents: 'none' }}>
//         <StartButton
//           active={open}
//           onClick={() => setOpen(!open)}
//           fullWidth
//           size="lg"
//         >
//           {/* <LogoIcon image="/icons/start-icon.png" alt="" /> */}
//           {/* <Icon src={VaultIcon} alt="icon" style={{ height: 30 }} /> */}
//           <Icon src={StartIcon} alt="icon" />
//           Start
//         </StartButton>
//         <Flex
//           alignItems={['start', null, 'center']}
//           justifyContent={['start', null, 'space-between']}
//           flexDirection={['column', null, 'row']}
//           style={{marginLeft: 120}}
//         >
//           <Flex justifyContent="space-between" alignItems="center">
//             <PageComponents />
//           </Flex>
//           {/* <Flex justifyContent="space-between" alignItems="center">
//                 <NavItem to="/play">Buy RUNE ${runePriceUsd.toNumber()}</NavItem>
//                 <NavItem to="/play">MCAP ${runePriceUsd.toNumber()}</NavItem>
//             </Flex> */}
//         </Flex>
//         <div style={{ display: "flex", flexGrow: 1 }}></div>
//         {/* <Bar size={38} /> */}
//         {/* <div
//           style={{
//             display: "flex",
//             fontWeight: "bold",
//             marginLeft: "5px",
//             marginRight: "2px",
//             minWidth: 80,
//             minHeight: 43,
//           }}
//           onClick={() => handleMenu("absorbening")}
//         >
//           <Button
//             active
//             style={{ fontWeight: "bold", height: "43px", background: "none" }}
//           >
//             {currentTime}
//           </Button>
//         </div> */}
//       </SToolbar>
//       {/* <Clippy /> */}
//       {open && (
//         <SList
//           horizontalAlign="left"
//           verticalAlign="bottom"
//           open={open}
//           // onClick={() => setOpen(false)}
//           className="startmenu"
//         >
//           {/* {theme.name === "original" ? (
//             <SListItem
//               onClick={() => {
//                 dispatch(setTheme("windows"));
//                 dispatch(toggleScanLines(false));
//                 dispatch(toggleMatrix(false));
//                 dispatch(
//                   setBackground({
//                     value: `url(${Windows1})`,
//                     label: "Windows #1",
//                     repeat: false,
//                     opacity: 1,
//                   })
//                 );
//               }}
//             >
//               <Icon
//                 src={SwitchToWindows}
//                 height={43}
//                 width={200}
//                 style={{
//                   height: "43px",
//                   margin: "6px -10px 6px -9px",
//                   filter: "none",
//                 }}
//               />
//             </SListItem>
//           ) : null}
//           {theme.name !== "original" ? (
//             <SListItem
//               onClick={() => {
//                 dispatch(setTheme("original"));
//                 dispatch(toggleScanLines(true));
//                 dispatch(toggleMatrix(true));
//                 dispatch(
//                   setBackground({
//                     value: `url(${Matrix6})`,
//                     label: "Matrix #6",
//                     repeat: true,
//                     opacity: 0.3,
//                   })
//                 );
//               }}
//             >
//               <Icon
//                 src={SwitchToFinney}
//                 height={43}
//                 width={200}
//                 style={{
//                   height: "43px",
//                   margin: "6px -10px 6px -9px",
//                   filter: "none",
//                 }}
//               />
//             </SListItem>
//           ) : null} */}
//           <SListItem onClick={() => handleMenu("home")}>
//             <Icon src={VaultIcon} height={23} width={23} />
//             <span className="menu-text">Home</span>
//           </SListItem>
//           {/* <SListItem onClick={() => handleMenu("staking")}>
//             <Icon src={PcIcon} height={23} width={23} />
//             <span className="menu-text">Staking</span>
//           </SListItem> */}
//           {/* <SListItem
//             onMouseEnter={() => toggleLearn(true)}
//             onMouseLeave={() => toggleLearn(false)}
//             onClick={() => toggleLearn(true)}
//           >
//             <Icon src={FolderIcon} height={23} width={23} />
//             <span className="menu-text">Learn</span>
//             <span
//               style={{
//                 position: "absolute",
//                 right: 15,
//               }}
//             >
//               ▸
//             </span>
//             {showLearn ? (
//               <List
//                 css={css`
//                   position: absolute;
//                   left: 100%;
//                   bottom: 0;
//                 `}
//               >
//                 <SListItem onClick={() => handleMenu("about")}>
//                   <Icon src={AboutIcon} height={23} width={23} />
//                   <span className="menu-text">About</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("roadmap")}>
//                   <Icon src={RoadmapIcon} height={23} width={23} />
//                   <span className="menu-text">Roadmap</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("strategies")}>
//                   <Icon src={StrategiesIcon} height={23} width={23} />
//                   <span className="menu-text">Strategies</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("learn")}>
//                   <Icon src={LearnIcon} height={23} width={23} />
//                   <span className="menu-text">Learn More</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("faq")}>
//                   <Icon src={FaqIcon} height={23} width={23} />
//                   <span className="menu-text">Frequently Asked Questions</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("audit")}>
//                   <Icon src={AuditIcon} height={23} width={23} />
//                   <span className="menu-text">Audit</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("team")}>
//                   <Icon src={TeamIcon} height={23} width={23} />
//                   <span className="menu-text">Team</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("news")}>
//                   <Icon src={NewsIcon} height={23} width={23} />
//                   <span className="menu-text">News</span>
//                 </SListItem>
//               </List>
//             ) : null}
//           </SListItem> */}
//           {/* <SListItem
//             onMouseEnter={() => toggleProducts(true)}
//             onMouseLeave={() => toggleProducts(false)}
//             onClick={() => toggleProducts(true)}
//           >
//             <Icon src={FolderIcon} height={23} width={23} />
//             <span className="menu-text">Products</span>
//             <span
//               style={{
//                 position: "absolute",
//                 right: 15,
//               }}
//             >
//               ▸
//             </span>
//             {showProducts ? (
//               <List
//                 css={css`
//                   position: absolute;
//                   left: 100%;
//                   bottom: 0;
//                 `}
//               >
//                 <SListItem onClick={() => handleMenu("apeplanet")}>
//                   <Icon src={ApePlanetIcon} height={23} width={23} />
//                   <span className="menu-text">ApePlanet</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("mayhem")}>
//                   <Icon src={ProjectMayhemIcon} height={23} width={23} />
//                   <span className="menu-text">Mayhem</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("strategies")}>
//                   <Icon src={StrategiesIcon} height={23} width={23} />
//                   <span className="menu-text">More coming soon...</span>
//                 </SListItem>
//               </List>
//             ) : null}
//           </SListItem> */}
//           <SListItem
//             onMouseEnter={() => toggleTools(true)}
//             onMouseLeave={() => toggleTools(false)}
//             onClick={() => toggleTools(true)}
//           >
//             <Icon src={ToolsIcon} height={23} width={23} />
//             <span className="menu-text">Tools</span>
//             <span
//               style={{
//                 position: "absolute",
//                 right: 15,
//               }}
//             >
//               ▸
//             </span>
//             {showTools ? (
//               <List
//                 css={css`
//                   position: absolute;
//                   left: 100%;
//                   bottom: 0;
//                 `}
//               >
//                 {/* <SListItem onClick={() => handleMenu("transfer")}>
//                   <Icon src={RouterIcon} height={23} width={23} />
//                   <span className="menu-text">Transfer Gate</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("arbitrage")}>
//                   <Icon src={ArbitrageIcon} height={23} width={23} />
//                   <span className="menu-text">Arbitrage</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("marketwatch")}>
//                   <Icon src={MarketIcon} height={23} width={23} />
//                   <span className="menu-text">Market Watch</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("status")}>
//                   <Icon src={StatusIcon} height={23} width={23} />
//                   <span className="menu-text">Status</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("governance")}>
//                   <Icon src={GovernanceIcon} height={23} width={23} />
//                   <span className="menu-text">Governance</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("buy")}>
//                   <Icon src={BuyIcon} height={23} width={23} />
//                   <span className="menu-text">Buy ROOT</span>
//                 </SListItem> */}
//               </List>
//             ) : null}
//           </SListItem>
//           <SListItem
//             onMouseEnter={() => togglePokemon(true)}
//             onMouseLeave={() => togglePokemon(false)}
//             onClick={() => togglePokemon(true)}
//           >
//             <Icon src={PokemonIcon} height={23} width={23} />
//             <span className="menu-text">Pokemon</span>
//             <span
//               style={{
//                 position: "absolute",
//                 right: 15,
//               }}
//             >
//               ▸
//             </span>
//             {showPokemon ? (
//               <List
//                 css={css`
//                   position: absolute;
//                   left: 100%;
//                   bottom: 0;
//                 `}
//               >
//                 {/* <SListItem onClick={() => handleMenu("pokemonsets")}>
//                   <Icon src={ZombsIcon} height={23} width={23} />
//                   <span className="menu-text">Browse Sets</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("pokemoncards")}>
//                   <Icon src={AgarioIcon} height={23} width={23} />
//                   <span className="menu-text">Browse Cards</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("pokemontop100")}>
//                   <Icon src={PowerlineIcon} height={23} width={23} />
//                   <span className="menu-text">Top 100</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("pokemonpopular")}>
//                   <Icon src={BrowserQuestIcon} height={23} width={23} />
//                   <span className="menu-text">Most Popular</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("pokemonundervalued")}>
//                   <Icon src={DiabloIcon} height={23} width={23} />
//                   <span className="menu-text">Most Undervalued</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("pokemonovervalued")}>
//                   <Icon src={SolitaireIcon} height={23} width={23} />
//                   <span className="menu-text">Most Overvalued</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("pokemoncollection")}>
//                   <Icon src={BrowserQuestIcon} height={23} width={23} />
//                   <span className="menu-text">My Collection</span>
//                 </SListItem> */}
//               </List>
//             ) : null}
//           </SListItem>
//           <SListItem
//             onMouseEnter={toggleOther}
//             onMouseLeave={toggleOther}
//             onClick={toggleOther}
//           >
//             <Icon src={FolderIcon} height={23} width={23} />
//             <span className="menu-text">Other</span>
//             <span
//               style={{
//                 position: "absolute",
//                 right: 15,
//               }}
//             >
//               ▸
//             </span>
//             {showOther ? (
//               <List
//                 css={css`
//                   position: absolute;
//                   left: 100%;
//                   bottom: 0;
//                 `}
//               >
//                 {/* <SListItem onClick={() => handleMenu("player")}>
//                   <Icon src={PlayerIcon} height={23} width={23} />
//                   <span className="menu-text">Media Player</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("tv")}>
//                   <Icon src={TvIcon} height={23} width={23} />
//                   <span className="menu-text">TV</span>
//                 </SListItem>
//                 <SListItem onClick={() => handleMenu("browser")}>
//                   <Icon src={BrowserIcon} height={23} width={23} />
//                   <span className="menu-text">Browser</span>
//                 </SListItem> */}
//               </List>
//             ) : null}
//           </SListItem>
//           {isDev && (
//             <SListItem
//               onMouseEnter={() => toggleWip(true)}
//               onMouseLeave={() => toggleWip(false)}
//               onClick={() => toggleWip(true)}
//             >
//               <Icon src={FolderIcon} height={23} width={23} />
//               <span className="menu-text">WIP</span>
//               <span
//                 style={{
//                   position: "absolute",
//                   right: 15,
//                 }}
//               >
//                 ▸
//               </span>
//               {showWip ? (
//                 <List
//                   css={css`
//                     position: absolute;
//                     left: 100%;
//                     bottom: 0;
//                   `}
//                 >
//                   <SListItem onClick={() => handleMenu("warzone")}>
//                     <Icon src={GovernanceIcon} height={23} width={23} />
//                     <span className="menu-text">Warzone</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("liquidity2")}>
//                     <Icon src={PcIcon} height={23} width={23} />
//                     <span className="menu-text">Liquidity Event 2</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("coins")}>
//                     <Icon src={CoinsIcon} height={23} width={23} />
//                     <span className="menu-text">Coins</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("search")}>
//                     <Icon src={SearchIcon} height={23} width={23} />
//                     <span className="menu-text">Search</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("vault")}>
//                     <Icon src={VaultIcon} height={23} width={23} />
//                     <span className="menu-text">Vault</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("wallet")}>
//                     <Icon src={TvIcon} height={23} width={23} />
//                     <span className="menu-text">Wallet</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("cinema")}>
//                     <Icon src={CinemaIcon} height={23} width={23} />
//                     <span className="menu-text">Cinema</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("absorbening")}>
//                     <Icon src={TvIcon} height={23} width={23} />
//                     <span className="menu-text">Flippening</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("playground")}>
//                     <Icon src={RoadmapIcon} height={23} width={23} />
//                     <span className="menu-text">Playground</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("swap")}>
//                     <Icon src={RoadmapIcon} height={23} width={23} />
//                     <span className="menu-text">Swap</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("launch")}>
//                     <Icon src={RoadmapIcon} height={23} width={23} />
//                     <span className="menu-text">Launch Project</span>
//                   </SListItem>
//                   <SListItem onClick={() => handleMenu("raiders")}>
//                     <Icon src={RoadmapIcon} height={23} width={23} />
//                     <span className="menu-text">Raiders</span>
//                   </SListItem>
//                 </List>
//               ) : null}
//             </SListItem>
//           )}
//           {/* <Divider />
//           <SListItem onClick={() => handleMenu("connect")}>
//             <Icon src={WalletIcon} height={23} width={23} />
//             <span className="menu-text">Connect Wallet</span>
//           </SListItem>
//           <SListItem onClick={() => handleMenu("settings")}>
//             <Icon src={SettingsIcon} height={23} width={23} />
//             <span className="menu-text">Settings</span>
//           </SListItem> */}
//         </SList>
//       )}
//     </SAppBar>
//   );
// };

// export default NavBar;

// const SAppBar = styled(AppBar)`
//   top: auto;
//   bottom: 0;
//   z-index: 100;
//   bottom: calc(var(--safe-area-inset-bottom) - 5px);

//   ${({ theme }) =>
//     theme.name === "original"
//       ? `
//         opacity: 0.92;
//         background: none;
//         box-shadow: none;

//         .toolbar {
//           background: none;
//         }
//       `
//       : ""}

//   ${({ theme }) =>
//     theme.name === "pokemon"
//       ? `
//         opacity: 0.85;
//         background: none;
//         box-shadow: none;

//         .toolbar {
//           background: none;
//         }
//       `
//       : ""}

//   .menu-icon {
//     display: inline-block;
//     margin-top: 11px;
//     margin-right: 9px;
//   }

//   .startmenu .menu-text {
//     margin-left: 0.7rem;
//     vertical-align: super;
//   }

//   .toolbar .menu-text {
//     margin-left: 0.4rem;
//     vertical-align: super;
//   }

//   @media ${({ theme }) => theme.MEDIA_MOBILE_ONLY} {
//     .toolbar .menu-text {
//       display: none;
//     }
//   }

//   .last-li {
//     padding-top: 4px;
//   }

//   ${({ theme }) =>
//     theme.name === "original"
//       ? `
//         border: 0;
//         bottom: calc(var(--safe-area-inset-bottom) - 0px);
//         img {
//           filter: grayscale(100%) brightness(70%) sepia(100%) hue-rotate(60deg) saturate(300%);
//         }
//       `
//       : ""}

//   ${({ theme }) =>
//     theme.name === "pokemon"
//       ? `
//         border: 0;
//         bottom: calc(var(--safe-area-inset-bottom) - 0px);
//       `
//       : ""}
// `;
// const Icon = styled.img`
//   image-rendering: pixelated;
//   /* filter: grayscale(1); */
//   height: 24px;
//   display: inline-block;
// `;

// const StartButton = styled(Button)`
//   margin: 0 5px;
//   font-weight: bold;
//   padding-right: 10px;
//   max-width: 50px;
//   opacity: 0;

//   img {
//     padding-right: 8px;
//     ${({ theme }) =>
//       theme.name === "original"
//         ? `
//           filter: invert(1) grayscale(100%) brightness(70%) sepia(100%) hue-rotate(60deg) saturate(300%);
//         `
//         : ""}
//   }

// `;
// const SToolbar = styled(Toolbar)`
//   position: relative;
//   margin: 0 -1px;
//   overflow-x: hidden;
//   background-color: ${({ theme }) => theme.materialDark};
// `;
// const SList = styled(List)`
//   position: absolute;
//   top: 100%;
//   left: 8px;
// `;
// const SListItem = styled(ListItem)`
//   justify-content: end;
//   cursor: pointer !important;
//   position: relative;

//   ${({ theme }) =>
//     theme.name === "original"
//       ? `
//   &:hover {
//     & > img {
//       filter: grayscale(100%) brightness(90%) saturate(10000%) contrast(6);
//     }
//   }
//   `
//       : ""}
// `;
