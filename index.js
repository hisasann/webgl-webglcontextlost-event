(() => {
  let extWebGLLoseContext;
  let webGLErrorCode;
  let gl;

  document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('#lost').addEventListener('click', function() {
      loseContext();
    }, false);
    document.querySelector('#restore').addEventListener('click', function() {
      restoreContext();
    }, false);

    let canvas = document.querySelector('#canvas');
    gl = canvas.getContext('webgl');

    webGLErrorCode = gl.NO_ERROR;
    let initialGlError = gl.getError();
    if (initialGlError !== gl.NO_ERROR) {
      webGLErrorCode = initialGlError;
    }
    // 画面ロード時に webglcontextlost のままを想定するテストをする場合用
    // this.webGLErrorCode = this.gl.CONTEXT_LOST_WEBGL;
    console.log('isWebGLError: ' + isWebGLError());

    canvas.addEventListener('webglcontextlost', (event) => {
      console.error('---webglcontextlost---');
      event.preventDefault();

      // canvas まわりの dispose 処理をここで呼ぶ

      // webglcontextlost イベント時のエラーコードを保存しておく
      // gl.getError() は一回でも呼ぶと、その後は正常値を返す可能性があるので必要なタイミングで一回だけ呼ぶこと
      webGLErrorCode = gl.getError();
    }, false);

    canvas.addEventListener('webglcontextrestored', () => {
      console.error('---webglcontextrestored---');

      // webglcontextrestored イベントでリストアされた場合に限り画面をリストアする
      windowRestore();
    }, false);

    // 画面ロード時に gl にエラーがある場合は canvas の処理を実行しない
    if (webGLErrorCode !== gl.NO_ERROR) {
      console.log('画面ロード時に WebGL の Error が発生: ' + webGLErrorCode);
      return;
    }

    initCanvas(canvas);
  });

  function initCanvas(canvas) {
    let renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });

    extWebGLLoseContext = renderer.context.getExtension('WEBGL_lose_context');
  }

  function windowRestore() {
    location.reload();
  }

  function isWebGLError() {
    let isError = false;

    if (webGLErrorCode !== gl.NO_ERROR) {
      isError = true;
      console.error('gl.getError(): ' + webGLErrorCode);
    } else {
      console.log('gl.getError(): ' + webGLErrorCode);
    }

    return isError;
  }

  function loseContext() {
    extWebGLLoseContext.loseContext();
    console.log('isWebGLError: ' + isWebGLError());
  }

  function restoreContext() {
    extWebGLLoseContext.restoreContext();
  }
})();
