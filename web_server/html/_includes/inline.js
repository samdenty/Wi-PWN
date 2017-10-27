{% if page.inline-js %}{{ page.inline-js }}{% endif %}
/(^|;)\s*minimal=/.test(document.cookie) && (document.body.id = "minimal");