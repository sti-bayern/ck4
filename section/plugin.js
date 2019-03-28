'use strict';

(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('section', {
        requires: 'api,dialog,widget',
        icons: 'section',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            var classes = !!editor.config.section ? Object.getOwnPropertyNames(editor.config.section) : [];
            var allowedClasses = {};

            if (classes.length <= 0) {
                return;
            }

            classes.forEach(function (item) {
                allowedClasses[item] = true;
            });

            /**
             * Widget
             */
            editor.widgets.add('section', {
                button: editor.lang.section.title,
                dialog: 'section',
                template: '<section class=""><h2></h2><div class="media"></div><div class="content"></div></section>',
                editables: {
                    title: {
                        selector: 'h2',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            }
                        }
                    },
                    media: {
                        selector: '.media',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            },
                            audio: {
                                attributes: {controls: true, src: true},
                                requiredAttributes: {controls: true, src: true}
                            },
                            figcaption: true,
                            figure: {
                                classes: {audio: true, iframe: true, image: true, left: true, right: true, video: true}
                            },
                            iframe: {
                                attributes: {allowfullscreen: true, height: true, src: true, width: true},
                                requiredAttributes: {src: true}
                            },
                            img: {
                                attributes: {alt: true, height: true, src: true, width: true},
                                requiredAttributes: {src: true}
                            },
                            video: {
                                attributes: {controls: true, height: true, src: true, width: true},
                                requiredAttributes: {src: true}
                            }
                        }
                    },
                    content: {
                        selector: '.content',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            },
                            br: true,
                            em: true,
                            p: true,
                            li: true,
                            ol: true,
                            strong: true,
                            ul: true
                        }
                    }
                },
                allowedContent: {
                    div: {
                        classes: {content: true, media: true}
                    },
                    h2: true,
                    section: {
                        classes: allowedClasses
                    }
                },
                requiredContent: 'section',
                defaults: {
                    type: ''
                },
                upcast: function (el, data) {
                    var type;

                    // Accept only sections with configured classes
                    if (el.name !== 'section' || !(type = CKEDITOR.api.parser.hasClass(el, classes))) {
                        return false;
                    }

                    // Remove empty sections
                    if (el.children.length <= 0) {
                        var text = new CKEDITOR.htmlParser.text('');
                        el.replaceWith(text);

                        return text;
                    }

                    var children = el.children;
                    el.children = [];
                    data.type = type;

                    // Title
                    var title = children[0].name === 'h2' ? children.shift() : new CKEDITOR.htmlParser.element('h2');
                    el.add(title, 0);

                    // Media
                    var media = new CKEDITOR.htmlParser.element('div', {'class': 'media'});
                    el.add(media, 1);

                    if (children.length > 0 && !!CKEDITOR.api.parser.isMediaFigure(children[0])) {
                        media.add(children.shift());
                    }

                    // Content
                    if (children.length > 0 && children[0].name === 'div' && children[0].hasClass('content')) {
                        el.add(children.shift(), 2);
                    } else {
                        var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});
                        el.add(content, 2);
                        children.forEach(function (item) {
                            if (item.isEmpty || item.getHtml().trim()) {
                                content.add(item);
                            }
                        });
                    }

                    return true;
                },
                downcast: function (el) {
                    if (!this.data.type) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    // Content
                    el.children[2].setHtml(this.editables.content.getData());
                    el.children[2].children.forEach(function (item) {
                        if (!item.isEmpty && !item.getHtml().trim()) {
                            item.remove();
                        }
                    });

                    if (el.children[2].children.length <= 0) {
                        el.children[2].remove();
                    }

                    // Media
                    el.children[1].setHtml(this.editables.media.getData());
                    var media = el.children[1].getFirst('figure');

                    if (!!CKEDITOR.api.parser.isMediaFigure(media)) {
                        el.children[1].replaceWith(media);
                    } else {
                        el.children[1].remove();
                    }

                    // Title
                    if (!el.children[0].getHtml().trim()) {
                        el.children[0].remove();
                    } else {
                        el.children[0].attributes = [];
                    }

                    return el.children.length > 0 ? el : new CKEDITOR.htmlParser.text('');
                },
                data: function () {
                    var el = this.element;

                    if (this.data.type) {
                        classes.forEach(function (item) {
                            el.removeClass(item);
                        });
                        el.addClass(this.data.type);
                    }
                }
            });

            /**
             * Dialog
             */
            CKEDITOR.dialog.add('section', this.path + 'dialogs/section.js');
        }
    });

    /**
     * Dialog definition
     */
    CKEDITOR.on('dialogDefinition', function (ev) {
        if (ev.data.name !== 'section') {
            return;
        }

        /**
         * Type select
         */
        var cfg = ev.editor.config.section;
        var type = ev.data.definition.contents[0].elements[0];
        type.items = [[ev.editor.lang.common.notSet, '']].concat(Object.getOwnPropertyNames(cfg).map(function (item) {
            return [cfg[item], item];
        }).sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }

            if (a[0] > b[0]) {
                return 1;
            }

            return 0;
        }));
    }, null, null, 1);
})(CKEDITOR);
