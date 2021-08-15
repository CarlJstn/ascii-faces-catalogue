import * as fs from "fs";
import { AsciiFace, pixelSizes } from "../models/AsciiFace";
import { DateTime } from "luxon";

// this script generates a json file that creates asciiFaces based on the faces array and for each of the pixelSizes
const generateFaces = () => {
  const faces: string[] = [
    "( ͡° ͜ʖ ͡°)",
    "( ͡° ل͜ ͡°)",
    "( ° ͜ʖ °)",
    "( ‾ʖ̫‾)",
    "☞ó ͜つò☞",
    "(˵ ͡° ͜ʖ ͡°˵)",
    "( ͠° ͟ʖ ͠°)",
    "(ᴗ ͜ʖ ᴗ)",
    "( ͡° ͜ʖ ͡ – ✧)",
    "( ͠° ͟ ͜ʖ ͡ ͠°)",
    "(˵ ͡o ͜ʖ ͡o˵)",
    "(⟃ ͜ʖ ⟄)",
    "(✿◠‿◠)",
    "( ° ᴗ°)~ð (/❛o❛)",
    "( ＾◡＾)っ✂❤",
    "（￣ε￣ʃƪ）",
    "•́ε•̀٥",
    "( ಠ ͜ʖಠ)",
    "(｀∀´)Ψ ",
    "(`A´)",
    "ヽ(ｏ`皿′ｏ)ﾉ",
    "-(`෴´)-",
    "Ψ(`_´ # )↝",
    "(╬≖_≖)",
    "(ᕵ﹏ᕴ)",
    "(ᕘ⸟ᕚ)",
    "ᕴｰᴥｰᕵ",
    "(Ф_Ф)",
    "ʕ⁀ᴥ⁀ʔ",
    "・㉨・",
    "ᵔᴥᵔ",
    "ʕ•ᴥ•ʔ",
    "❃ႣᄎႣ❃",
    "ʕᵔᴥᵔʔ",
    "ʕᵕᴥᵕʔ",
    "xʕ≧ᴥ≦ʔx",
    "ʕ◉ᴥ◉ʔ",
    "ʕ⁀㉨⁀ʔ",
    "ʕʽɞʼʔ",
    "(人ﾟ ∀ﾟ)",
    "( uωu人 )",
    "人⍲‿⍲人",
    "(⊙﹏⊙)",
    "(ᵕ﹏ᵕ)",
    "(⊙﹏⊙)",
    "༼つ ◕_◕ ༽つ",
    "o(´д｀o)",
    "(ↁ_ↁ)",
    "(⊙_◎)",
    "●.◉",
    "(☉_☉)",
    "(◑○◑)",
    "◔_◔",
    "٩◔̯◔۶",
    "┌( •́ ਊ •̀ )┐",
    "༼ ͒ ̶ ͒༽",
    "(ಥ _ʖಥ)",
    "(TдT)",
    "(ToT)",
    "(ಥ﹏ಥ)",
    "(╥_╥)",
    "( ͡°❥ ͡°)",
    "( ͡°⊱ ͡°)",
    "ᕕ(⌐■_■)ᕗ ♪♬",
    "( ノ・・)ノ",
    "（〜^∇^ )〜",
    "( ﾉ･ｪ･ )ﾉ",
    "＼(ﾟ ｰﾟ＼)",
    "( ノ・・ )ノ",
    "（〜 ^∇^ )〜",
    "(._.) ƪ(‘-‘ ƪ)(ʃ ‘-‘)ʃ (/._.)/",
    "♪♪＼(^ω^＼)( /^ω^)/♪♪",
    "~( ˘▾˘~)",
    "( ノ ^o^)ノ",
    "( ͡°Ĺ̯ ͡° )",
    "(,Ծ_Ծ,)",
    "▼・ᴥ・▼",
    "▼(´ᴥ`)▼",
    "U ´ᴥ` U",
    "༼⌐ ■ل͟■ ༽",
    "༼つಠ益ಠ ༽つ ─=≡ΣO))",
    "╰༼.◕ヮ ◕.༽つ¤=[]————",
    "༼ ಠل͟ಠ༽ ̿ ̿ ̿ ̿’̿’̵з= ༼ຈل͜ຈ༽ﾉ",
    "♬♩♪♩ヽ༼ ˘ل͜ ˘ ༽ﾉ♬♩♪♩",
    "( ͡ᵔ ͜ʖ ͡ᵔ )",
    "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)",
    "(͠≖ ͜ʖ͠≖)",
    "(≧▽≦)",
  ];

  // create a counter for minutesToAdd
  // this is to make sure that the dateAdded are not very close to each other
  let minutesToAdd = 0;

  // maps thru all the faces, and generate a 2d array: AsciiFace[][]
  const asciiFaces = faces.map((face) => {
    // maps thru all the pixelSizes
    return pixelSizes.map((pixelSize): AsciiFace => {
      // generate a random id
      const space = () => Math.floor(Math.random() * 100000000).toString(36);
      const time = () => Math.floor(Date.now() / 1000).toString(36);
      const id = `${space()}${time()}`;

      // generate a random price
      const randomPrice = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;

      // creates the assciFace object
      const asciiFace: AsciiFace = {
        id,
        face,
        priceInCents: randomPrice,
        dateAdded: DateTime.now().plus({ minutes: minutesToAdd }).toISO(),
        size: pixelSize,
      };

      // increase minutesToAdd by 1 for every face
      minutesToAdd += 1;

      return asciiFace;
    });
  });

  // create a single array from the asciiFaces
  const mergedArrayOfAsciiFaces = Array.prototype.concat.apply([], asciiFaces);

  // creates a new json file
  // overrides if there's already a json file
  fs.writeFileSync(
    "./public/asciiFaces.json",
    JSON.stringify({ asciiFaces: mergedArrayOfAsciiFaces })
  );
};

generateFaces();
