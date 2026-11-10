# History-live graphics in Everfolk

The skill tree, compact skill paths, life record, full chronicle and lifetime rail use the character creator's ivory paper, brown outlines, olive selection, numbered chips and hard shadows. Shared values are in `client/creator-tokens.css`. Learning uses faience and mastery uses gold. State labels and icons accompany colour.

Life-record influence markers name the source and deed. Famous figures use a star; people of the city use a diamond. These appear only when a journal entry has a ranked influence source.

The figure reveal, kept-life page and market use the creator's collectible cards. Alexander and Euclid reuse the existing exports; Aristotle and Cleomenes have profiles alongside them in `character-creator/historical-figures/`. Aristotle's ivory clothing and Cleomenes's grain-administration theme follow the same renderer. Their card subtitles identify their roles.

`public/assets/figures/<id>.png` is a 480 × 640 collectible card; `<id>-front.png` is the transparent front sprite. These are copied exports, so changing a creator profile requires exporting again and replacing both public assets.

The contract catalog uses these images too. For local development, run `pnpm ranked:world`. Before publishing the catalog to a contract, run `FIGURE_MEDIA_BASE_URL=https://YOUR_PUBLIC_HOST pnpm ranked:world`, verify that all four image URLs are publicly reachable, and upload the generated catalog through the normal deployment process. This does not change metadata on an already deployed contract or already minted NFTs.

The application retains its existing typefaces and simulation behavior. The creator's visual system changes how progression and records are presented.
