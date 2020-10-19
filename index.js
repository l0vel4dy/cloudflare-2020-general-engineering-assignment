// Root url
const root = 'https://my-project.britgreenhalgh.workers.dev';

// External urls
const staticUrl = 'https://static-links-page.signalnerve.workers.dev';
const avatarUrl = 'https://scontent.faus1-1.fna.fbcdn.net/v/t1.0-9/14470387_183307095441851_5003844457930584360_n.jpg?_nc_cat=109&_nc_sid=09cbfe&_nc_ohc=PvTtmx4g0l0AX84elwk&_nc_ht=scontent.faus1-1.fna&oh=76a75208ca729c363831e9880abd9e17&oe=5FB42146';
const backgroundUrl = 'https://cdn.hipwallpaper.com/i/54/72/hklOAz.jpg';

// Website data
const name = 'Brittany Greenhalgh';
const title = 'Hello World!';
const links = [
	{
		"name": "LinkedIn",
		"url": "https://linkedin.com/in/connectedwithbrittany",
	},
	{
		"name": "Github",
		"url": "https://github.com/l0vel4dy",
	},
	{
		"name": "Cloudflare",
		"url": "https://dash.cloudflare.com/",
	},
];
const socialLinks = [
	{
		"url": "https://github.com/l0vel4dy",
		"svg": "https://simpleicons.org/icons/github.svg",
	},
	{
		"url": "https://www.linkedin.com/in/connectedwithbrittany/",
		"svg": "https://simpleicons.org/icons/linkedin.svg",
	},
        {
                "url": "https://dash.cloudfare.com/",
                "svg": "https://simpleicons.org/icons/cloudflare.svg"
        }
];

class LinksTransformer {
	element(element) {
		links.forEach(link => {
			element.append(`
				<a target="_blank" href=${link.url}>
					${link.name}
				</a>
				`, { html: true }
			);
		})
	}
}

class SocialTransformer {
	element(element) {
		element.removeAttribute('style');
		socialLinks.forEach(socialLink => {
			element.append(`
				<a target="_blank" href=${socialLink.url}>
					<img src=${socialLink.svg} />
				</a>
				`, { html: true }
			);
		})
	}
}

const rewriter = new HTMLRewriter()
	.on("div#links", new LinksTransformer())
	.on("div#profile", { element: e => e.removeAttribute('style') })
	.on("img#avatar", { element: e => e.setAttribute('src', avatarUrl) })
	.on("h1#name", { element: e => e.setInnerContent(name) })
	.on("title", { element: e => e.setInnerContent(title) })
	.on("body", { element: e => e.setAttribute('style', `background: url(${backgroundUrl}) no-repeat center; background-size: cover;`) })
	.on("div#social", new SocialTransformer())

// Request
async function handleRequest(request) {
	if (request.url === root + '/links') {
		return new Response(JSON.stringify(links, null, 2), {
			headers: { 'content-type': 'application/json;charset=UTF-8' },
		})
	} else {
		const page = await fetch(staticUrl);
		const transformed = rewriter.transform(page);
		const html = await transformed.text();
		return new Response(html, {
			headers: { 'content-type': 'text/html;charset=UTF-8' },
		})
	}
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})
