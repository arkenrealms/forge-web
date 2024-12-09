import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Nft } from '~/config/constants/types';

interface PreviewProps {
  nft: Nft;
  onClick?: () => void;
  isOwned?: boolean;
}

const Container = styled.div`
  // background-color: ${({ theme }) => theme.colors.borderColor};
  position: relative;
  width: 100%;
  // overflow: hidden;
  // padding-bottom: 100%;
`;

const StyledImage = styled.img`
  // position: absolute;
  // width: 100%;
  // top: 0;
  // left: 0;
  transition: opacity 1s linear;
  height: 100%;
  object-fit: cover;
  border-radius: 32px 32px 0 0;
`;

const StyledVideo = styled.video`
  height: 100%;
  width: 100%;
`;

const Preview: React.FC<PreviewProps> = ({ nft, onClick, isOwned = false }) => {
  const { images, name, video } = nft;
  const previewImageSrc = `/images/character-classes/${images.lg}`;

  if (video) {
    const videoComponent = (
      <StyledVideo autoPlay controls={false} loop muted poster={previewImageSrc}>
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </StyledVideo>
    );

    return isOwned ? (
      <Link to={images.ipfs} target="_blank" rel="noreferrer noopener">
        {videoComponent}
      </Link>
    ) : (
      videoComponent
    );
  }

  const previewImage = <StyledImage src={previewImageSrc} alt={name} onClick={onClick} />;

  return (
    <Container>
      {/* {isOwned ? (
        <Link to={images.ipfs} target="_blank" rel="noreferrer noopener">
          {previewImage}
        </Link>
      ) : ( */}
      {previewImage}
      {/* )} */}
    </Container>
  );
};

export default Preview;
