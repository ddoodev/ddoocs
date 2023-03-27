var welcomeText = ("\n" +
    "d8888b. d8888b.  .d88b.   .d88b.   .o88b. .d8888. \n" +
    "88  `8D 88  `8D .8P  Y8. .8P  Y8. d8P  Y8 88'  YP \n" +
    "88   88 88   88 88    88 88    88 8P      `8bo.   \n" +
    "88   88 88   88 88    88 88    88 8b        `Y8b. \n" +
    "88  .8D 88  .8D `8b  d8' `8b  d8' Y8b  d8 db   8D \n" +
    "Y8888D' Y8888D'  `Y88P'   `Y88P'   `Y88P' `8888Y' \n"
);
if (console.info) {
  console.info(`%c${welcomeText}`, 'color: #E14E4E');
} else {
  console.log(`%c${welcomeText}`, 'color: #E14E4E');
}
