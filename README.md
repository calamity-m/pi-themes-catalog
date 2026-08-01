# pi themes catalog

A collection of themes for the [pi coding agent](https://pi.dev).

## Themes

- `catppuccin-frappe`
- `catppuccin-mocha`
- `dracula`
- `everforest`
- `gruvbox-dark`
- `gruvbox-light`
- `kanagawa`
- `monokai`
- `nord`
- `one-dark`
- `rose-pine`
- `solarized-dark`
- `solarized-light`
- `tokyo-night`
- `umber`

## Install

Install the package from GitHub:

```sh
pi install git:github.com/calamity-m/pi-themes-catalog
```

Or install a local checkout:

```sh
pi install /path/to/pi-themes-catalog
```

Select a theme from `/settings` after installation.

To try one theme without installing the package:

```sh
pi --theme ./themes/kanagawa.json
```

## Development

Add pi-compatible JSON theme files to [`themes/`](themes/), then validate the catalog:

```sh
npm test
```

See pi's [theme documentation](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/themes.md) for the format and required color tokens.

## License

MIT
