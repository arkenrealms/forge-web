import random from 'lodash/random';

// Array of available nodes to connect to
const nodes = [
  process.env.REACT_APP_NODE_1,
  process.env.REACT_APP_NODE_2,
  process.env.REACT_APP_NODE_3,
  process.env.REACT_APP_NODE_4,
  // process.env.REACT_APP_NODE_5,
  process.env.REACT_APP_NODE_6,
  process.env.REACT_APP_NODE_7,
];

const getNodeUrl = () => {
  // if (window.navigator.userAgent === 'ReactSnap')
  //   return 'https://bsc-dataseed1.defibit.io'
  if (window.navigator.userAgent === 'ReactSnap')
    return 'https://autumn-blue-meadow.bsc.quiknode.pro/6b0e7864e252135989a5346630683db90691012a/'; // process.env.REACT_APP_NODE_4//"https://bsc.getblock.io/mainnet/?api_key=3f594a5f-d0ed-48ca-b0e7-a57d04f76332" //process.env.REACT_APP_NODE_1
  // if (window.location.hostname === 'localhost')
  //   return 'https://thrumming-still-leaf.bsc.quiknode.pro/b2f8a5b1bd0809dbf061112e1786b4a8e53c9a83/' //

  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

export default getNodeUrl;
