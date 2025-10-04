const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

//Delete a URL from the database

exports.deleteURL = async function (req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.mapping_long_short_url.findUnique({
      where: { map_id: id },
    });

    if (!existing) {
      return res.json({ error: "This URL doesn't exist in our database." });
    }

    await prisma.mapping_long_short_url.delete({
      where: { map_id: id },
    });

    return res.json({ message: "The URL has been deleted successfully." });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "The server is down, Try again later." });
  }
};

exports.redirectURL = async function (req, res) {
  let shortSlug = req.params.shorturl;

  const prefix = req.route.path.split(":")[0];
  if (prefix === "/_/") {
    shortSlug = "_/" + shortSlug;
  }

  if (!shortSlug) {
    return res.status(400).json({ error: "No short URL was provided." });
  }

  const result = await prisma.mapping_long_short_url.findFirst({
    where: { short_slug: shortSlug },
    select: { original_url: true },
  });

  if (result) {
    return res.redirect(result.original_url);
  } else {
    return res
      .status(400)
      .json({ error: "No short URL found for the given input." });
  }
};

exports.createShortURL = async function (req, res) {
  let originalURL = req.body.originalURL?.trim();
  let shortSlug = req.body.shortSlug?.trim();
  let username = req.body.username;

  if (!originalURL) {
    return res
      .status(400)
      .json({ error: "No long URL has been provided.", name: "long" });
  }

  if (shortSlug && !req?.session?.passport?.user) {
    return res
      .status(401)
      .json({ error: "You need to be logged in.", name: "short" });
  }

  const originalUrlLength = originalURL.length;
  if (originalUrlLength > 2048) {
    return res.status(400).json({
      error: "You exceeded the maximum length of a URL.",
      name: "long",
    });
  }

  const containsHTTPSRegex = /^https?/i;
  const containsHTTPS = containsHTTPSRegex.test(originalURL);
  if (!containsHTTPS) {
    originalURL = "https://" + originalURL;
  }

  try {
    new URL(originalURL);

    if (!shortSlug) {
      
      try {
        const [counterUpdate, createdRandomURL] = await prisma.$transaction(
          async (tx) => {
            const counterUpdate = await tx.counter.update({
              where: { id: 1 },
              data: { count: { increment: 1 } },
              select: { count: true },
            });

            shortSlug = "_/" + convertToBase62(counterUpdate.count);

            const createdRandomURL = await tx.mapping_long_short_url.create({
              data: {
                original_url: originalURL,
                short_slug: shortSlug,
                username: username || null,
              },
              select: { map_id: true },
            });

           

            return [counterUpdate, createdRandomURL];
          }
        );

        return res.json({
          map_id: createdRandomURL.map_id,
          username: username || "",
          original_url: originalURL,
          short_slug: shortSlug,
          short_url:
            process.env.BASE_URL +
            "/" +
            "_/" +
            convertToBase62(counterUpdate.count),
        });
      } catch (err) {
        console.error("Transaction failed:", err);
        return res
          .status(500)
          .json({ error: "Could not create short slug, please try again." });
      }
    }

    const shortSlugLength = shortSlug.length;

    if (shortSlugLength > 100) {
      return res.status(400).json({
        error: "The maximum number of characters in the slug should be 100.",
        name: "short",
      });
    }

    const slugRegex = /^[a-zA-Z0-9_-]+$/;
    if (!slugRegex.test(shortSlug)) {
      return res
        .status(400)
        .json({ error: "Invalid slug format.", name: "short" });
    }

    const result = await prisma.mapping_long_short_url.findFirst({
      where: { short_slug: shortSlug },
      select: { original_url: true },
    });

    const shortSlugExists = !!result;

    if (!shortSlugExists) {
      const created = await prisma.mapping_long_short_url.create({
        data: { original_url: originalURL, short_slug: shortSlug, username },
        select: { map_id: true },
      });

      return res.json({
        map_id: created.map_id,
        original_url: originalURL,
        short_slug:shortSlug,
        short_url: process.env.BASE_URL + "/" + shortSlug,
        username,
      });
    }

    const extracted_original_url = result.original_url;

    if (extracted_original_url !== originalURL) {
      return res.status(400).json({
        error: "This short URL already corresponds to a different URL.",
        name: "short",
      });
    }

    if (extracted_original_url === originalURL) {
      const usernameResult = await prisma.mapping_long_short_url.findFirst({
        where: { original_url: originalURL, short_slug: shortSlug, username },
        select: { username: true },
      });

      const usernameOfOriginalURL = usernameResult?.username;

      if (usernameOfOriginalURL === username) {
        return res.status(400).json({
          error: "This short URL is already in your list.",
          name: "short",
        });
      }

      const created = await prisma.mapping_long_short_url.create({
        data: { original_url: originalURL, short_slug: shortSlug, username },
        select: { map_id: true },
      });

      return res.json({
        map_id: created.map_id,
        original_url: originalURL,
        short_slug: shortSlug,
        short_url: process.env.BASE_URL + "/" + shortSlug,
        username,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: "The long URL you have provided is invalid.",
      name: "long",
    });
  }
};

function convertToBase62(number) {
  let map = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "a",
    11: "b",
    12: "c",
    13: "d",
    14: "e",
    15: "f",
    16: "g",
    17: "h",
    18: "i",
    19: "j",
    20: "k",
    21: "l",
    22: "m",
    23: "n",
    24: "o",
    25: "p",
    26: "q",
    27: "r",
    28: "s",
    29: "t",
    30: "u",
    31: "v",
    32: "w",
    33: "x",
    34: "y",
    35: "z",
    36: "A",
    37: "B",
    38: "C",
    39: "D",
    40: "E",
    41: "F",
    42: "G",
    43: "H",
    44: "I",
    45: "J",
    46: "K",
    47: "L",
    48: "M",
    49: "N",
    50: "O",
    51: "P",
    52: "Q",
    53: "R",
    54: "S",
    55: "T",
    56: "U",
    57: "V",
    58: "W",
    59: "X",
    60: "Y",
    61: "Z",
  };

  let remainder = number % 62;
  let quotient = (number - remainder) / 62;
  let newQuotient;

  let convertedNumber = [];

  if (quotient === 0) {
    return map[number];
  }

  convertedNumber.push(map[remainder]);

  while (quotient > 0) {
    remainder = quotient % 62;
    newQuotient = (quotient - remainder) / 62;

    if (newQuotient === 0) {
      convertedNumber.push(map[quotient]);
      quotient = newQuotient;
    } else {
      convertedNumber.push(map[remainder]);
      quotient = newQuotient;
    }
  }

  convertedNumber = convertedNumber.reverse().join("");

  return convertedNumber;
}
