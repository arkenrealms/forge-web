import React, { lazy, Suspense, useContext, useCallback, useEffect, useState, useRef } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon, Skeleton } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { PurchaseModal } from '~/components/PurchaseModal';
import Area from '~/components/Sanctuary/Area';
import jQ from './jquery';
import something from './something';
import loadDragdealer from './dragdealer';

const zzz = styled.div``;

let $;
const StatsComponent = lazy(() => import(/* webpackChunkName: "StatsComponent" */ '~/components/Stats'));

const Lore = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const breakpoints = useMatchBreakpoints();

  const [page, setPage] = useState('');

  useEffect(
    function () {
      if (!window) return;
      jQ();
      something();

      // @ts-ignore
      window.innerShiv = (function () {
        let d;
        let r;

        return function (h, u) {
          if (!d) {
            d = document.createElement('div');
            r = document.createDocumentFragment();
            /*@cc_on d.style.display = 'none';@*/
          }

          const e = d.cloneNode(true);
          /*@cc_on document.body.appendChild(e);@*/
          e.innerHTML = h.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
          /*@cc_on document.body.removeChild(e);@*/

          if (u === false) return e.childNodes;

          const f = r.cloneNode(true);
          let i = e.childNodes.length;
          while (i--) f.appendChild(e.firstChild);

          return f;
        };
      })();

      const slideBufferSize = 10;
      const slideMode = false;
      const slideSpeed = 10;
      const ajaxMode = true;

      // @ts-ignore
      function initializeMap($$) {
        $ = $$;
        loadDragdealer(window);

        // const location = new String(window.location);

        // let onResize;
        // let lastHashChange = null;

        // const doThings = function(id, name, path, myIndex) {
        //   $('.sitenav-sub').hide();
        //   if ($('.navlink.navtoggle').is(':visible')) {
        //     $('.sitenav .w-layout-grid.grid-2').hide(); // mobile
        //   }

        //   // var sectionTarget = $('.item.is--show');

        //   // if(sectionTarget.length) { // section is already good to go
        //   //   const heading = $('.content-header h1', sectionTarget).html()
        //   //   document.title = heading ? heading + ' - Rune' : 'Rune';

        //   //   onResize({reposition: false});

        //   //   var speed = slideMode ? slideSpeed : 0;

        //   //   sectionTarget.find('.item-content').scrollTo(sectionTarget.parent(), speed);

        //   //   return;
        //   // }

        //   $('.item.is--show .item-content').html(''); // TODO: remove

        //   // REPLACE THIS
        //   // $.ajax({
        //   //     url: path,
        //   //     success: (content) => {
        //   //       const newContent = $('<div>' + content.match(/<body[^>]*>(.|\n)*<\/body>/gmi)[0].replace(/<body[^>]*>/gmi, '').replace(/<\/body>/gmi, '') + '</div>');

        //   //       const newHtml = '<section id="' + id + '">' + newContent.html() + '</section>';

        //   //       let sectionTarget = myIndex !== undefined ? $(".item").eq(myIndex) : $('.item.is--show')
        //   //         $(".item").removeClass("is--show");
        //   //         if (sectionTarget.length === 0) {
        //   //             sectionTarget = $('.item').first()
        //   //             // @ts-ignore
        //   //             targetElement = sectionTarget.find('.item-content')
        //   //             // @ts-ignore
        //   //             slideOpen.play();

        //   //             sectionTarget.addClass('active is--show');
        //   //         } else {
        //   //           // @ts-ignore
        //   //             slideOpen.play();
        //   //             sectionTarget.addClass("is--show");
        //   //         }

        //   //         sectionTarget.find('.item-content').html(''); // TODO: remove
        //   //         // @ts-ignore
        //   //         $(innerShiv(newHtml)).appendTo(sectionTarget.find('.item-content'));

        //   //         // var sectionTarget = sectionTarget.find('.item-content').find('#' + id);

        //   //         const heading = $('.content-header h1', sectionTarget).html()
        //   //         document.title = heading ? heading + ' - Rune' : 'Rune';

        //   //         // sectionTarget.addClass('active is--show');

        //   //         onResize({reposition: false});

        //   //         const speed = slideMode ? slideSpeed : 0;

        //   //         sectionTarget.find('.item-content').scrollTo(sectionTarget.parent(), speed);
        //   //     }
        //   // });

        // };

        const music = document.getElementById('music');
        const mapHover = document.getElementById('map-hover');
        const zoomHoverIn = document.getElementById('zoom-hover-in');
        const zoomHoverOut = document.getElementById('zoom-hover-out');
        const zoomClick = document.getElementById('zoom-click');
        const dotClick = document.getElementById('dot-click');
        const slideOpen = document.getElementById('slide-open');
        const slideClose = document.getElementById('slide-close');

        // const onClickPageLoader = function() {
        //   // @ts-ignore
        //     if($(this).hasClass('map-dot')) {
        //       // @ts-ignore
        //       const path = $(this).data('load-page') === 'x' ? $(this).attr('href').slice(1) : $(this).data('load-page');

        //       const x1 = path.match(/\/(.*)$/);

        //       const name = x1 ? x1[1] : '';

        //       const id = name ? name.replace(/\//gi, '_') : 'home';

        //       // @ts-ignore
        //       doThings(id, name, path);
        //     } else {
        //       // @ts-ignore
        //       const path = $(this).data('load-page') === 'x' ? $(this).attr('href').slice(1) : $(this).data('load-page');
        //       const ele = $('[onClick={() => loadPage("' + path + '"]'))}>

        //       const myIndex = ele.length > 0 ? ele.index() : 0;

        //       const x1 = path.match(/\/(.*)$/);

        //       const name = x1 ? x1[1] : '';

        //       const id = name ? name.replace(/\//gi, '_') : 'home';

        //       doThings(id, name, path, myIndex);

        //       $('.sitenav-sub').hide();

        //       return false;
        //     }
        // };

        // const onHashChange = function(a) {
        //     if (!a) return
        //     if (a.path === '/' && !lastHashChange) return

        //   lastHashChange = a;

        //   const path = a ? a.path : window.location.hash.substr(1);

        //   const x1 = path.match(/\/(.*)$/);

        //   const name = x1 ? x1[1] : '';

        //   const id = name ? name.replace(/\//gi, '_') : 'home';

        //   // @ts-ignore
        //   doThings(id, name, path);
        // };

        const onResize = function (params = { reposition: true }) {
          params = $.extend(
            {
              reposition: true,
            },
            params
          );

          $('section.active .content-body-wrapper', $('.item.is--show .item-content')).css('height', function () {
            return (
              $(window).height() -
              $('section.active .content-header', $('.item.is--show .item-content')).height() -
              70 -
              20 -
              20 -
              40
            ); // 20 padding/margin
          });

          // $('.pane > ul').css({
          //   width: parseInt($(window).width()) * 5 + 'px',
          //   height: parseInt($(window).height()) * 5 + 'px'
          // });

          // $('.pane > ul > li').each(function() {
          //   $(this).css({
          //     width: $(window).width(),
          //     height: $(window).height()
          //   });
          // });

          // $('section.active .content-body', $('.item.is--show .item-content')).jScrollPane();

          if (!$('section.active .content-fade').length)
            // already init?
            $('section.active .content-body')
              .prepend('<div class="content-fade top"></div>')
              .append('<div class="content-fade bottom"></div>');

          if (params.reposition) {
            const sectionTarget = $('section.active', $('.item.is--show .item-content'));

            $('.item.is--show .item-content').scrollTo(sectionTarget.parent());
          }
        };

        $(window).bind('resize', onResize);

        if (!ajaxMode) return;

        const initializeAjaxMode = function () {
          onResize();

          // $.address.internalChange(onHashChange);
          // $.address.externalChange(onHashChange);

          // $(window).load(function() {
          //   if(!lastHashChange)
          //     // @ts-ignore
          //     onHashChange();
          // });

          // $(document).on('click', '[data-load-page]', onClickPageLoader);
        };

        initializeAjaxMode();

        // @ts-ignore
        $('.map-dot').each(function () {
          // @ts-ignore
          const posX = $(this).children('.map-pos-x').html();
          // @ts-ignore
          const posY = $(this).children('.map-pos-y').html();
          // @ts-ignore
          $(this).css('margin-left', posX + 'em');
          // @ts-ignore
          $(this).css('margin-top', posY + 'em');
          // @ts-ignore
          const loadPageURL = $(this).children('.load-page').html();
          //   $(this).data( "load-page", loadPageURL );
          // @ts-ignore
          // $(this).attr( "data-load-page", "/area/"+loadPageURL.replace(/\s+/g, '-').toLowerCase() );
        });

        // @ts-ignore
        const canvasMask = new window.Dragdealer('canvas-mask', {
          // start in the center from left and right
          x: 0.5,
          // start in the center from top and bottom
          y: 0,
          vertical: true,
          speed: 0.05,
          loose: false,
          slide: true,
          handleClass: 'map-image',
          requestAnimationFrame: true,
          animationCallback: (x, y) => {
            $('.sitenav-sub').hide();
          },
          dragStartCallback: (x, y) => {
            // @ts-ignore
            $('#landing-intro, #landing-actions').addClass('disabled');
            $('.map-image').css('opacity', 1);
          },
        });

        if (music) {
          // @ts-ignore
          music.load();
          // @ts-ignore
          mapHover.load();
          // @ts-ignore
          zoomHoverIn.load();
          // @ts-ignore
          zoomHoverOut.load();
          // @ts-ignore
          zoomClick.load();
          // @ts-ignore
          dotClick.load();
          // @ts-ignore
          slideOpen.load();
          // @ts-ignore
          slideClose.load();
          // @ts-ignore
          music.volume = 0.1;
          // @ts-ignore
          mapHover.volume = 0.2;
          // @ts-ignore
          zoomHoverIn.volume = 0.2;
          // @ts-ignore
          zoomHoverOut.volume = 0.2;
          // @ts-ignore
          zoomClick.volume = 0.2;
          // @ts-ignore
          dotClick.volume = 0.2;
          // @ts-ignore
          slideOpen.volume = 0.2;
          // @ts-ignore
          slideClose.volume = 0.2;
        }

        let isPlaying = false;

        $(document).on('click', function () {
          if (!isPlaying) {
            // @ts-ignore
            // music.play();
            isPlaying = true;
          }
        });

        $('.box').on('mouseenter', function () {
          // @ts-ignore
          mapHover.currentTime = 0;
          // @ts-ignore
          mapHover.play();
        });

        $('.button').on('mouseenter', function () {
          // @ts-ignore
          zoomHoverIn.play();
        });

        $('.button').on('mouseleave', function () {
          // @ts-ignore
          zoomHoverOut.play();
        });

        $('.button').on('click', function () {
          // @ts-ignore
          zoomClick.currentTime = 0;
          // @ts-ignore
          zoomClick.play();
        });

        const { isMd, isLg, isXl, isXxl, isXxxl } = breakpoints;
        const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
        const isLargeTablet = !isXxxl;
        const isSmallTablet = !isXxl && !isXxxl;
        // Zoom Code
        let zoomLevel = isMobile ? 2 : isSmallTablet ? 1 : isLargeTablet ? 1 : 1; //isMobile ? 2 : isSmallTablet ? 2 : isLargeTablet ? 2 : 1
        // $('.map-image').css('font-size', isMobile ? '3em' : isSmallTablet ? '2.5em' : isLargeTablet ? '2em' : '1em')
        $('.map-image').css('font-size', isMobile ? '2em' : isSmallTablet ? '1em' : isLargeTablet ? '1em' : '1em');
        canvasMask.reflow();

        // ZOOM IN
        $('.zoom-in').on('click', function () {
          if (zoomLevel < 2) {
            zoomLevel += 0.2;
          }
          $('.map-image').css('font-size', zoomLevel + 'em');
          canvasMask.reflow();
        });

        // ZOOM Out
        $('.zoom-out').on('click', function () {
          if (zoomLevel > 1) {
            zoomLevel -= 0.2;
          }
          $('.map-image').css('font-size', zoomLevel + 'em');
          canvasMask.reflow();
        });

        // Close Popup
        $('.item-link').on('click', function () {
          // @ts-ignore
          slideClose.play();
          $('.item').removeClass('is--show');
          // $('#landing-intro, #landing-actions').removeClass('disabled')
        });

        // Update map position on click
        $('#canvas-mask').on('click', '.box', function (e) {
          e.preventDefault();
          const mapImage = $('.map-image');
          const anchor = $(e.currentTarget).closest('.map-dot');
          const myWidth = mapImage.innerWidth();
          const myHeight = mapImage.innerHeight();
          const marginLeft = anchor.css('margin-left');
          const offsetLeft = parseInt(marginLeft, 10);
          const marginTop = anchor.css('margin-top');
          const offsetTop = parseInt(marginTop, 10);
          console.log(offsetLeft / myWidth);
          console.log(offsetTop / myHeight);
          const xValue = offsetLeft / myWidth;
          const yValue = offsetTop / myHeight;
          canvasMask.setValue(xValue, yValue);
          // $('.sitenav-sub').hide()
          // if ($('.navlink.navtoggle').is(':visible')) {
          //   $('.sitenav .w-layout-grid.grid-2').hide() // mobile
          // }
        });
        // Open PopupdotClick
        // $(".box").on("click", function () {
        //     let myIndex = $(this).closest(".map-dot").index();
        //     if ($(".item.is--show").length) {
        //         $(".item").removeClass("is--show");
        //         slideClose.play();
        //         setTimeout(() => {
        //             // slideOpen.play();
        //             // $(".item").eq(myIndex).addClass("is--show");

        //             var path = $(this).closest(".map-dot").data('load-page');

        //             var x1 = path.match(/\/(.*)$/);

        //             var name = x1 ? x1[1] : '';

        //             var id = name ? name.replace(/\//gi, '_') : 'home';

        //             doThings(id, name, path, myIndex);

        //             return false;
        //         }, 600);
        //     } else {
        //         dotClick.play();
        //         // slideOpen.play();
        //         // $(".item").eq(myIndex).addClass("is--show");

        //         var path = $(this).closest(".map-dot").data('load-page');

        //         var x1 = path.match(/\/(.*)$/);

        //         var name = x1 ? x1[1] : '';

        //         var id = name ? name.replace(/\//gi, '_') : 'home';

        //         doThings(id, name, path, myIndex);

        //         return false;
        //     }
        // });

        // $('html').click(function (e) {
        //   if (!$(e.target).parents('.sitenav').length) {
        //     $('.sitenav-sub').hide()
        //     if ($('.navlink.navtoggle').is(':visible')) {
        //       $('.sitenav .w-layout-grid.grid-2').hide() // mobile
        //     }
        //   }
        // })

        // $('.navlink').click(function () {
        //   // @ts-ignore
        //   $('.sitenav-sub')
        //     // @ts-ignore
        //     .not('#menu-' + $(this).data('menu-id'))
        //     .hide()
        //   // @ts-ignore
        //   $('#menu-' + $(this).data('menu-id')).toggle()
        // })
      }

      // @ts-ignore
      setTimeout(() => $(document).ready(initializeMap), 100);
    },
    [breakpoints]
  );

  const loadPage = (path) => {
    setPage(path);

    // @ts-ignore
    document.getElementById('slide-open').play();
    // @ts-ignore
    const sectionTarget = $('#map-container .item');

    sectionTarget.addClass('is--show');

    setTimeout(function () {
      const slideMode = false;
      const slideSpeed = 10;
      const speed = slideMode ? slideSpeed : 0;

      sectionTarget.find('.item-content').scrollTo(0, speed); //sectionTarget.parent(), speed)
    }, 0);
  };

  return (
    <>
      <div id="map-container" className="lore-container">
        <div
          id="canvas-mask"
          className="map-contain w-dyn-list active"
          css={css`
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
            min-height: 50%;
            min-width: 50%;
          `}>
          <div
            role="list"
            className="map-image w-dyn-items"
            style={{
              perspective: '1000px',
              backfaceVisibility: 'hidden',
              transform: 'translateX(0px) translateY(-296px)',
            }}>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/crystalline-depths')}>
              <div className="load-page">Crystalline Depths</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/etherwold')}>
              <div className="load-page">Etherwold</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/tenotichi')}>
              <div className="load-page">Tenotichi</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/lashiid')}>
              <div className="load-page">Lashiid</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/wall-of-tukra')}>
              <div className="load-page">Wall of Tukra</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/khagresh')}>
              <div className="load-page">Khagresh</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/elaris')}>
              <div className="load-page">Elaris</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/myst-reef')}>
              <div className="load-page">Myst Reef</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/gardens-of-bronth')}>
              <div className="load-page">Gardens of Bronth</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/zakraad-wastes')}>
              <div className="load-page">Zakraad Wastes</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/elder-spires')}>
              <div className="load-page">Elder Spires</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/frostlands')}>
              <div className="load-page">Frostlands</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/archon-islands')}>
              <div className="load-page">Archon Islands</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/mycelia')}>
              <div className="load-page">Mycelia</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/forsaken-lands')}>
              <div className="load-page">Forsaken Lands</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/morgraf-hold')}>
              <div className="load-page">Morgraf Hold</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage("/area/ashyrah")} style={{marginLeft: '62em', marginTop: '29em'}}>
            <div className="load-page">Ashyrah</div>
            <div className="map-pos-x">62</div>
            <div className="map-pos-y">29</div>
            <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
              <div className="box-inner-2">
                <div style={{width: '50%', height: '50%'}} className="box-inner2-2">
                  <div style={{width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)'}} className="box-inner3">
                    <div style={{opacity: 0}} className="box-inner4" />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/agar-bassim’s-fjords')}>
              <div className="load-page">Agar-Bassim’s Fjords</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/obsidian-city')}
              style={{ marginLeft: '59em', marginTop: '52em' }}>
              <div className="load-page">Obsidian City</div>
              <div className="map-pos-x">59</div>
              <div className="map-pos-y">52</div>
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/bronze-sierras')}>
              <div className="load-page">Bronze Sierras</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/fayhelm')}
              style={{ marginLeft: '39em', marginTop: '16em' }}>
              <div className="load-page">Fayhelm</div>
              <div className="map-pos-x">39</div>
              <div className="map-pos-y">16</div>
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/haqor-bay')}>
              <div className="load-page">Haqor Bay</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/qiddir-desert')}>
              <div className="load-page">Qiddir Desert</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/axelas')}>
              <div className="load-page">Axelas</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/penalem-icelands')}>
              <div className="load-page">Penalem Icelands</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/newkirk-stronghold')}>
              <div className="load-page">Newkirk Stronghold</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/bladesong-ocean')}>
              <div className="load-page">Bladesong Ocean</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/hevane')}>
              <div className="load-page">Hevane</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/halfice-sea')}>
              <div className="load-page">Halfice Sea</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/faytree')}>
              <div className="load-page">Faytree</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/toralir')}>
              <div className="load-page">Toralir</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/hexwood')}>
              <div className="load-page">Hexwood</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/archon-citadel')}
              style={{ marginLeft: '78em', marginTop: '44em' }}>
              <div className="load-page">Archon Citadel</div>
              <div className="map-pos-x">78</div>
              <div className="map-pos-y">44</div>
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/nassau')}>
              <div className="load-page">Nassau</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/ashyrah-spine')}>
              <div className="load-page">Ashyrah Spine</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/tarv')}>
              <div className="load-page">Tarv</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/maeteha')}>
              <div className="load-page">Maeteha</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/forest-of-tilia')}>
              <div className="load-page">Forest of Tilia</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/frigid-abyss')}>
              <div className="load-page">Frigid Abyss</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/iron-inlet')}>
              <div className="load-page">Iron Inlet</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/elysium')}
              style={{ marginLeft: '65em', marginTop: '20em' }}>
              <div className="load-page">Elysium</div>
              <div className="map-pos-x">65</div>
              <div className="map-pos-y">20</div>
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/tabr')}>
              <div className="load-page">Tabr</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/trail-of-misery')}>
              <div className="load-page">Trail of Misery</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/newerth')}
              style={{ marginLeft: '33em', marginTop: '30em' }}>
              <div className="load-page">Newerth</div>
              <div className="map-pos-x">33</div>
              <div className="map-pos-y">30</div>
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/blackrock-castle')}>
              <div className="load-page">Blackrock Castle</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/arreat-summit')}>
              <div className="load-page">Arreat Summit</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage("/area/tarmor's-bay")}>
              <div className="load-page">Tarmor's Bay</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/qiddir')}>
              <div className="load-page">Qiddir</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/otho')}>
              <div className="load-page">Otho</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/jasri')}>
              <div className="load-page">Jasri</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/westmarsh')}>
              <div className="load-page">Westmarsh</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/pillars-of-rust')}>
              <div className="load-page">Pillars of Rust</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/elshanai')}>
              <div className="load-page">Elshanai</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/floating-islands-of-elysium')}>
              <div className="load-page">Floating Islands of Elysium</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/western-ashyrah-spine-(dwarven-mountains)')}>
              <div className="load-page">Western Ashyrah Spine (Dwarven Mountains)</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/urgavod')}>
              <div className="load-page">Urgavod</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/aldia-gulf')}>
              <div className="load-page">Aldia Gulf</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/azran')}>
              <div className="load-page">Azran</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/forests-of-fayhelm')}>
              <div className="load-page">Forests of Fayhelm</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/free-city-of-vtello')}>
              <div className="load-page">Free City of Vtello</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/karpeshti')}>
              <div className="load-page">Karpeshti</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/radiant-sea')}>
              <div className="load-page">Radiant Sea</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/end-of-time')}>
              <div className="load-page">End of Time</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/linden')}>
              <div className="load-page">Linden</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/irondell')}>
              <div className="load-page">Irondell</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/dragonhollow')}>
              <div className="load-page">Dragonhollow</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/arcane-sanctuary')}>
              <div className="load-page">Arcane Sanctuary</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/copper-desert')}>
              <div className="load-page">Copper Desert</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/eseldagon-sea')}>
              <div className="load-page">Eseldagon Sea</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage("/area/ragor's-teeth")}>
              <div className="load-page">Ragor's Teeth</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/agrador')}>
              <div className="load-page">Agrador</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/hills-of-carnage')}>
              <div className="load-page">Hills of Carnage</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/samyrah')}>
              <div className="load-page">Samyrah</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/valburn')}
              style={{ marginLeft: '38em', marginTop: '40em' }}>
              <div className="load-page">Valburn</div>
              <div className="map-pos-x">38</div>
              <div className="map-pos-y">40</div>
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/taladar')}>
              <div className="load-page">Taladar</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/tabr-gulf')}>
              <div className="load-page">Tabr Gulf</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage("/area/der'uden")}>
              <div className="load-page">Der'uden</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/plains-of-ashyrah')}>
              <div className="load-page">Plains of Ashyrah</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              role="listitem"
              className="map-dot is--1 w-dyn-item"
              onClick={() => loadPage('/area/volcanic-mountains-of-misery')}>
              <div className="load-page">Volcanic Mountains of Misery</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/mataro-peak')}>
              <div className="load-page">Mataro Peak</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="listitem" className="map-dot is--1 w-dyn-item" onClick={() => loadPage('/area/narim')}>
              <div className="load-page">Narim</div>
              <div className="map-pos-x w-dyn-bind-empty" />
              <div className="map-pos-y w-dyn-bind-empty" />
              <div data-w-id="53a81d1a-21eb-be76-4458-35e0d30fe0d8" className="box">
                <div className="box-inner-2">
                  <div style={{ width: '50%', height: '50%' }} className="box-inner2-2">
                    <div
                      style={{ width: '60%', height: '60%', backgroundColor: 'rgb(187, 38, 38)' }}
                      className="box-inner3">
                      <div style={{ opacity: 0 }} className="box-inner4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div> */}

        <audio id="music" loop>
          <source src="https://arken.gg/sound/music/haerra1.mp3" type="audio/mpeg" />
        </audio>

        <audio id="map-hover">
          <source src="https://arken.gg/sound/fx/map_hover.mp3" type="audio/mpeg" />
        </audio>

        <audio id="zoom-hover-in">
          <source src="https://arken.gg/sound/fx/hover_generic_04.mp3" type="audio/mpeg" />
        </audio>

        <audio id="zoom-hover-out">
          <source src="https://arken.gg/sound/fx/unhover_soft.mp3" type="audio/mpeg" />
        </audio>

        <audio id="zoom-click">
          <source src="https://arken.gg/sound/fx/click_generic_01.mp3" type="audio/mpeg" />
        </audio>

        <audio id="dot-click">
          <source src="https://arken.gg/sound/fx/map_click.mp3" type="audio/mpeg" />
        </audio>

        <audio id="slide-open">
          <source src="https://arken.gg/sound/fx/slide_open.mp3" type="audio/mpeg" />
        </audio>

        <audio id="slide-close">
          <source src="https://arken.gg/sound/fx/slide_close.mp3" type="audio/mpeg" />
        </audio>

        <div className="wrap w-dyn-list">
          <div role="list" className="list w-dyn-items">
            <div role="listitem" className="item w-dyn-item active">
              <a href="#" className="item-link w-inline-block">
                <img
                  src="/images/6191209fd9f12099f6491727_back-arrow.svg"
                  loading="lazy"
                  alt=""
                  className="item-link_arrow"
                />
              </a>
              <div className="border">
                <div className="border-images is--top">
                  <img
                    src="/images/61935114b8097608f785185e_c1-top-right.png"
                    loading="lazy"
                    alt=""
                    className="border-image is--1"
                  />
                  <div className="line"></div>
                  <img
                    src="/images/619120a6e44b94d27de059a6_border.png"
                    loading="lazy"
                    alt=""
                    className="border-image"
                  />
                </div>
                <div className="side-border"></div>
                <div className="border-images">
                  <img
                    src="/images/619120a6e44b94d27de059a6_border.png"
                    loading="lazy"
                    alt=""
                    className="border-image is--3"
                  />
                  <div className="line"></div>
                  <img
                    src="/images/619120a6e44b94d27de059a6_border.png"
                    loading="lazy"
                    alt=""
                    className="border-image is--4"
                  />
                </div>
              </div>
              <div id="item-content" className="item-content">
                {page ? <Area id={page.replace('/area/', '')} /> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="map-ui">
          <div className="button zoom-in" style={{ backgroundColor: 'rgb(202, 185, 150)', color: 'rgb(0, 0, 0)' }}>
            <div className="button-icon w-embed">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 62.814 62.814">
                <g id="Group_1" data-name="Group 1" transform="translate(-823.389 -215.389)">
                  <path
                    id="Path_1"
                    data-name="Path 1"
                    d="M945.832,199.324v62.814"
                    transform="translate(-91.233 16.065)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                  <path
                    id="Path_2"
                    data-name="Path 2"
                    d="M0,0V62.814"
                    transform="translate(823.389 246.6) rotate(-90)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </g>
              </svg>
            </div>
            <div
              className="button-outline"
              style={{
                transform:
                  'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
                transformStyle: 'preserve-3d',
              }}
            />
          </div>
          <div className="button zoom-out" style={{ backgroundColor: 'rgb(202, 185, 150)', color: 'rgb(0, 0, 0)' }}>
            <div
              className="button-outline"
              style={{
                transform:
                  'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
                transformStyle: 'preserve-3d',
              }}
            />
            <div className="button-icon w-embed">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 62.814 5">
                <g id="Group_2" data-name="Group 2" transform="translate(-823.389 -244.1)">
                  <path
                    id="Path_2"
                    data-name="Path 2"
                    d="M0,0V62.814"
                    transform="translate(823.389 246.6) rotate(-90)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={5}
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lore;
