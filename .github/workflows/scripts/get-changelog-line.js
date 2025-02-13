const prData = JSON.parse(process.env.PR_DATA);

const { title, number, html_url, user, merged_at } = prData;

let changeline = `- ${title} ([#${number}](${html_url})) - [@${user.login}](${user.html_url})`;

if (merged_at) {
  const mergedDate = new Date(merged_at);
  const year = mergedDate.getFullYear();
  const month = String(mergedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const day = String(mergedDate.getDate()).padStart(2, '0');

  changeline += ` - ${year}-${month}-${day}`;
}

console.log(changeline);
