# Browser

This plugin provides a minimal browser API as an alternative to the [filebrowser plugin](https://ckeditor.com/cke4/addon/filebrowser) and does not care about advanced features like file uploads, so stick with the [filebrowser plugin](https://ckeditor.com/cke4/addon/filebrowser) if you need those.

Unlike the [filebrowser plugin](https://ckeditor.com/cke4/addon/filebrowser) it does not use URL parameters to pass values between the editor and the browser windows, but uses the [window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) function to communicate between both windows. So you can pass more than just the URL of the selected media from the media browser to the editor or even multiple media elements at once. Currently the only plugin that uses this API is the [Media Widget](https://ckeditor.com/cke4/addon/media).

## Plugin Integration

If you wanna use the API in your plugin, you just have to define a callback function `browser` and the `browserUrl` in the _Browse server_ button configuration of your plugin's dialog, p.e.

    {
        id: 'browse',
        type: 'button',
        label: common.browseServer,
        hidden: true,
        browser: function (data) {
            if (!data.src) {
                return;
            }

            var dialog = this.getDialog();

            ['alt', 'src', 'type'].forEach(function (item) {
                if (!!data[item]) {
                    dialog.getContentElement('info', item).setValue(data[item]);
                }
            });
        },
        browserUrl: '/url/to/browser'
    }

## Browser Integration

You can implement your browser as you wish, the only requirement is that your browser window notifies the editor window by posting a message p.e. like

    window.opener.postMessage({
        alt: 'Optional alternative text',
        src: '/url/to/media'
    }, origin);

## Demo

https://akilli.github.io/rte/ck4
    
## Minimalistic media browser example

https://github.com/akilli/rte/tree/master/browser