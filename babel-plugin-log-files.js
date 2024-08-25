// babel-plugin-log-files.js
module.exports = function () {
  return {
    visitor: {
      Program(path, state) {
        console.log('Babel is processing file:', state.filename);
      },
    },
  };
};
