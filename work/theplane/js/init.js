/**
 * The entry point of the whole game.
 * @author Saxon Jensen <saxon.jensen@hotmail.com>
 * @returns {undefined}
 */
function init() {
    Preloader.setCompleteListener(HTML.loadCompleteHandle);
    Preloader.setProgressListener(HTML.loadProgressHandle);
    Preloader.startLoad();
}
