'use strict';

(function (document, window, CKEDITOR) {
    CKEDITOR.dialog.add('media', function (editor) {
        var lang = editor.lang.media;
        var common = editor.lang.common;

        return {
            title: lang.title,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
            minWidth: 250,
            minHeight: 100,
            contents: [
                {
                    id: 'info',
                    label: lang.info,
                    elements: [
                        {
                            id: 'type',
                            type: 'select',
                            label: lang.type,
                            items: [
                                [common.notSet, ''],
                                [lang.image, 'img'],
                                [lang.audio, 'audio'],
                                [lang.video, 'video'],
                                [lang.iframe, 'iframe']
                            ],
                            setup: function (widget) {
                                this.setValue(widget.data.type);
                            },
                            commit: function (widget) {
                                widget.setData('type', this.getValue());
                            },
                            validate: CKEDITOR.dialog.validate.notEmpty(lang.validateRequired)
                        },
                        {

                            type: 'hbox',
                            children: [
                                {
                                    id: 'src',
                                    type: 'text',
                                    label: common.url,
                                    setup: function (widget) {
                                        this.setValue(widget.data.src);
                                    },
                                    commit: function (widget) {
                                        widget.setData('src', this.getValue());
                                    },
                                    validate: CKEDITOR.dialog.validate.notEmpty(lang.validateRequired)
                                },
                                {
                                    id: 'browse',
                                    type: 'button',
                                    label: common.browseServer,
                                    hidden: !editor.config.mediaBrowserUrl,
                                    onClick: function (ev) {
                                        if (!editor.config.mediaBrowserUrl) {
                                            return;
                                        }

                                        var win = window.open(
                                            editor.config.mediaBrowserUrl,
                                            'mediabrowser',
                                            'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes'
                                        );

                                        window.addEventListener('message', function (e) {
                                            if (e.origin === win.origin && e.data.id === 'mediabrowser' && !!e.data.src) {
                                                ev.data.dialog.getContentElement('info', 'src').setValue(e.data.src);

                                                if (!!e.data.alt) {
                                                    ev.data.dialog.getContentElement('info', 'alt').setValue(e.data.alt);
                                                }

                                                if (!!e.data.caption) {
                                                    ev.data.dialog.getContentElement('info', 'caption').setValue(true);
                                                }

                                                if (!!e.data.type) {
                                                    ev.data.dialog.getContentElement('info', 'type').setValue(e.data.type);
                                                }
                                            }
                                        }, false);
                                    }
                                }
                            ]
                        },
                        {
                            type: 'hbox',
                            children: [
                                {
                                    id: 'width',
                                    type: 'text',
                                    label: common.width,
                                    setup: function (widget) {
                                        this.setValue(widget.data.width);
                                    },
                                    commit: function (widget) {
                                        widget.setData('width', this.getValue());
                                    }
                                },
                                {
                                    id: 'height',
                                    type: 'text',
                                    label: common.height,
                                    setup: function (widget) {
                                        this.setValue(widget.data.height);
                                    },
                                    commit: function (widget) {
                                        widget.setData('height', this.getValue());
                                    }
                                }
                            ]
                        },
                        {
                            id: 'alt',
                            type: 'text',
                            label: lang.alt,
                            setup: function (widget) {
                                this.setValue(widget.data.alt);
                            },
                            commit: function (widget) {
                                widget.setData('alt', this.getValue());
                            }
                        },
                        {
                            id: 'link',
                            type: 'text',
                            label: lang.link,
                            setup: function (widget) {
                                this.setValue(widget.data.link);
                            },
                            commit: function (widget) {
                                widget.setData('link', this.getValue());
                            }
                        },
                        {
                            id: 'align',
                            type: 'radio',
                            label: common.align,
                            items: [
                                [common.alignNone, ''],
                                [common.left, 'left'],
                                [common.center, 'center'],
                                [common.right, 'right']
                            ],
                            setup: function (widget) {
                                this.setValue(widget.data.align);
                            },
                            commit: function (widget) {
                                widget.setData('align', this.getValue());
                            }
                        },
                        {
                            id: 'caption',
                            type: 'checkbox',
                            label: lang.caption,
                            setup: function (widget) {
                                this.setValue(widget.data.caption);
                            },
                            commit: function (widget) {
                                widget.setData('caption', this.getValue());
                            }
                        }
                    ]
                }
            ]
        };
    });
})(document, window, CKEDITOR);
