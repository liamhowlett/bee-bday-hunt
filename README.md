# Birthday Treasure Hunt 💝

A romantic treasure hunt website for your wife's birthday using What3Words locations.

## Setup Instructions

### 1. Customize the Content

Edit `script.js` and update the `CONFIG` object with your personalized content:

```javascript
const CONFIG = {
    what3wordsApiKey: 'YOUR_API_KEY_HERE',
    clues: [
        {
            title: "Location 1 of 3",
            story: "Add your romantic story here...",
            clue: "Your creative clue...",
            hint: "A helpful hint...",
            answer: "actual.what3words.location",
            successMessage: "Message after solving...",
            mapWords: "actual.what3words.location"
        },
        // ... add your 2 more clues
    ],
    finalLocation: {
        words: "final.what3words.location",
        message: "Your final message..."
    }
};
```

### 2. Customize the Welcome Letter

Edit `index.html` and update the welcome message (search for `[Her Name]` and replace the placeholders).

### 3. Get What3Words API Key (Optional but Recommended)

For the beautiful map embeds:

1. Go to https://what3words.com/select-plan
2. Sign up for the **FREE** plan (5,000 API calls/month)
3. Get your API key
4. Add it to `script.js` in the `what3wordsApiKey` field

**Note:** The site works without the API key, but maps won't display. She'll still see the What3Words location text.

### 4. Find Your What3Words Locations

1. Go to https://what3words.com/
2. Search or navigate to each location on your property
3. Click to get the 3-word address (e.g., `filled.count.soap`)
4. Copy these into your clues

## Deploying to GitHub Pages

### Option 1: Using GitHub Website (Easiest)

1. Create a GitHub account at https://github.com if you don't have one
2. Click the "+" icon in the top right → "New repository"
3. Name it: `bee-bday-hunt`
4. Make it **Private** (so she won't stumble upon it)
5. Don't initialize with README (we have our files)
6. Click "Create repository"

7. Upload your files:
   - Click "uploading an existing file"
   - Drag and drop all files (`index.html`, `style.css`, `script.js`)
   - Click "Commit changes"

8. Enable GitHub Pages:
   - Go to repository Settings → Pages (left sidebar)
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main`, folder: `/ (root)`
   - Click "Save"

9. Wait 1-2 minutes, then visit: `https://YOUR-USERNAME.github.io/bee-bday-hunt/`

### Option 2: Using Git Command Line

```bash
# Navigate to the project folder
cd C:\Users\lihowlet\Documents\bee-bday-hunt

# Initialize git
git init
git add .
git commit -m "Initial treasure hunt setup"

# Create GitHub repo (on github.com) then:
git remote add origin https://github.com/YOUR-USERNAME/bee-bday-hunt.git
git push -u origin main

# Enable GitHub Pages in repo Settings → Pages
```

## Testing Before Her Birthday

1. Open `index.html` in your browser (double-click the file)
2. Test each clue with the correct What3Words answers
3. Make sure all your custom messages display correctly
4. Test on mobile (since she'll use her phone)

## Security Note

**Make the GitHub repository PRIVATE** so she doesn't accidentally find it! GitHub Pages works with private repos too.

## Customization Ideas

- Edit colors in `style.css` (`:root` section) to match her favorite colors
- Change the emoji in titles and buttons
- Add photos by placing images in the folder and referencing them in the HTML
- Modify the fonts in CSS

## Troubleshooting

- **Maps not showing?** Add your What3Words API key or they'll show a placeholder
- **Site not updating?** GitHub Pages can take 1-2 minutes to rebuild
- **Wrong URL?** Should be: `https://YOUR-USERNAME.github.io/bee-bday-hunt/`

## On Her Birthday

1. Send her the link: `https://YOUR-USERNAME.github.io/bee-bday-hunt/`
2. Make sure physical messages are hidden at each location
3. Have the final gift ready at the last location

Good luck, and happy birthday to your wife! 🎂💕
