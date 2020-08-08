// Confirguation information for submitting form to Firebase
var config = {
  apiKey: "AIzaSyCsVANHYhX6PL4hpBb_tUWyNhXeaZe9m8s",
  authDomain: "shabbatograms.firebaseapp.com",
  databaseURL: "https://shabbatograms.firebaseio.com",
  projectId: "shabbatograms",
  storageBucket: "shabbatograms.appspot.com",
};

// Dictionary mapping org names to donation links and logos
var org_dict = {"B\'Nai Brith Camp Oregon": ["https://bbcamp.org/donate-now/", ""],
  "B\'Nai Brith Camp Manitoba": ["https://www.bbcamp.ca/camperships", ""],
  "Beber Camp": ["https://www.bebercamp.com/donate/", ""],
  "Camp Airy": ["https://www.airylouise.org/give-back/donate/", ""],
  "Camp Alonim": ["https://www.alonim.com/donate/", ""],
  "Camp Ben Frankel": ["https://www.campbenfrankel.org/donate", ""],
  "Camp Bob Waldorf": ["https://campbobwaldorf.org/donate/", ""],
  "Camp Daisy and Harry Stein": ["https://www.formstack.com/forms/?1841574-Jl7EdW2ygu", ""],
  "Camp Dora Golding": ["https://campdoragolding.com/campers-and-parents/donate/", ""],
  "Camp Gan Israel in the Poconos": ["http://cgipoconos.org/donatenow/", ""],
  "Camp Hatikvah": ["https://www.paypal.com/donate/?token=iaR82gs6IdrgPIzfvfWbBm7sPYFlxoeVM20WFQypItoBhSpP-wmhq4_IJahj9O2uNPppGG&country.x=CA&locale.x=CA", ""],
  "Camp Havaya": ["https://camphavaya.org/support/", ""],
  "Gindling Hilltop Camp": ["https://www.wbtcamps.org/support-our-camps", ""],
  "Camp Hess Kramer": ["https://www.wbtcamps.org/support-our-camps", ""],
  "Camp Judaea NC": ["https://www.campjudaea.org/support/giving-opportunities/", ""],
  "Camp Kadimah": ["https://interland3.donorperfect.net/weblink/weblink.aspx?name=E348513QE&id=27", ""],
  "Camp Kinder Ring": ["https://www.campkr.com/donate-to-kinder-ring/", ""],
  "Camp Louise": ["https://www.airylouise.org/give-back/donate/", ""],
  "Camp Massad Manitoba": ["https://campmassad.ca/donate-support/support-massad/", ""],
  "Camp Massad Montreal": ["https://campmassad.org/donations.html", ""],
  "Camp Moshava Ennismore": ["https://campmoshava.org/donate/", ""],
  "Camp Moshava Indian Orchard": ["https://moshavaio.campintouch.com/ui/forms/donor/Form", ""],
  "Camp Nageela East": ["https://campnageela.campintouch.com/ui/forms/donor/Form", ""],
  "Camp Nageela Midwest": ["https://pay.banquest.com/nageelamidwest", ""],
  "Camp Northland-B\'Nai Brith": ["https://www.campnbb.com/donate-now.html", ""],
  "Camp Pardas Chanah": ["https://www.camppc.com/donate/", ""],
  "Camp Ramah Darom": ["https://www.ramahdarom.org/ramah-darom-donation-form/", ""],
  "Camp Ramah in California": ["https://ramah.org/support-ramah/", ""],
  "Camp Ramah in New England": ["https://www.campramahne.org/giving/", ""],
  "Camp Ramah in Northern California": ["https://www.ramahnorcal.org/donors/donate/", ""],
  "Camp Ramah in the Berkshires": ["https://www.ramahberkshires.org/donate/", ""],
  "Camp Ramah in the Rockies": ["https://payments.cliq.com/Donation/ramah", ""],
  "Camp Ramah in the Poconos": ["https://interland3.donorperfect.net/weblink/WebLink.aspx?name=E3940&id=3", ""],
  "Camp Ramah in Canada": ["https://campramah.com/donate/", ""],
  "Ramah Sports Academy": ["https://46767.thankyou4caring.org/pages/rsa/donate", ""],
  "Camp Ramah in Wisconsin": ["https://give.ramahwisconsin.com/give/286404/#!/donation/checkout", ""],
  "Camp Solomon Schechter": ["https://www.campschechter.org/donate-now/", ""],
  "Camp Stone": ["https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=76LK8HJ4TSQA2&source=url", ""],
  "Camp Tel Noar": ["https://secure.qgiv.com/for/telnoar/", ""],
  "Camp Tevya": ["https://secure.qgiv.com/for/tevya", ""],
  "Camp Young Judaea New Hampshire": ["https://www.campyoungjudaea.com/donate-1", ""],
  "Camp Young Judaea Midwest": ["https://www.cyjmid.org/donate/", ""],
  "Camp Sprout Lake": ["https://www.cyjsproutlake.org/donate/", ""],
  "Camp Young Judaea Texas": ["https://www.cyjtexas.org/?form=covid19", ""],
  "Camp Zeke": ["https://campzeke.org/", ""],
  "Eden Village Camp": ["https://edenvillagecamp.org/support-us/", ""],
  "Eden Village West": ["https://www.edenvillagewest.org/support-us", ""],
  "Golden Slipper Camp": ["http://goldenslippercamp.org/donate/", ""],
  "Habonim Dror Camp Galil": ["https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=k7N2dt8P2C&pg_return_url=http%3A%2F%2Fwww.campgalil.org%2Fabout%2Fthank_you%2F", ""],
  "Habonim Dror Camp Gesher": ["https://www.canadahelps.org/en/charities/camp-gesher/", ""],
  "Habonim Dror Camp Gilboa": ["https://www.campgilboa.org/give", ""],
  "Habonim Dror Camp Moshava": ["https://www.campmosh.org/give", ""],
  "Habonim Dror Camp Tavor": ["https://www.camptavor.org/donate", ""],
  "Habonim Dror Camp Miriam": ["https://campmiriam.org/give/", ""],
  "Y Country Camp": ["https://frd.akaraisin.com/Donation/Event/Home.aspx?seid=8085&mid=8&Lang=en-CA", ""],
  "Hashomer Hatzair Camp Shomria US": ["https://www.campshomria.com/donate.html", ""],
  "Havaya Arts": ["https://havayaarts.org/support/", ""],
  "Camp Chi": ["https://campchi.jccchicago.org/donate/", ""],
  "Camp Kingswood": ["https://www.bostonjcc.org/donate", ""],
  "Maccabi Sports Camp": ["http://www.maccabisportscamp.org/support-camp/", ""],
  "Camp Mountain Chai": ["http://www.campmountainchai.com/support-cmc/", ""],
  "JCA Shalom": ["https://shalominstitute.com/support-us/donations/", ""],
  "Camp Tawonga": ["http://tawonga.org/support/donate/", ""],
  "Camp BB Riback": ["https://campbb.com/donate/", ""],
  "Camp Livingston": ["https://www.camplivingston.com/make-an-impact/", ""],
  "Tamarack Camps": ["https://tamarackcamps.com/giving/support/", ""],
  "Camp Sabra": ["https://www.campsabra.com/support/", ""],
  "Camp Avoda": ["https://campavoda.org/giving/", ""],
  "Surprise Lake Camp": ["https://interland3.donorperfect.net/weblink/WebLink.aspx?name=E12841&id=18", ""],
  "Camp Seneca Lake": ["https://donatenow.networkforgood.org/jccrochester", ""],
  "Camp Wise": ["https://online.mandeljcc.org/OnlineEdge/fundraising.html?event=Refresh&Fund=Camp%20Wise", ""],
  "Camp Barney Medintz": ["https://www.campbarney.org/give/", ""],
  "Camp Interlaken": ["https://www.campinterlaken.org/alumni/giving-back/donate-now/", ""],
  "Y Country Camp": ["https://frd.akaraisin.com/Donation/Event/Home.aspx?seid=8085&mid=8&Lang=en-CA", ""],
  "Berkshire Hills Eisenberg Camp": ["http://www.bhecamp.org/donate/", ""],
  "Pinemere Camp": ["https://www.pinemere.com/pinemere-alumni/donate-to-pinemere/", ""],
  "Capital Camps": ["https://capitalcamps.org/donate-now/?t=new", ""],
  "Emma Kaufmann Camp": ["https://emmakaufmanncamp.com/donate/", ""],
  "Camp Poyntelle": ["https://www.poyntelle.com/donate/", ""],
  "NCSY Camp Maor": ["https://summer.ncsy.org/donate/", "NCSY Camp Maor.png"],
  "NJY Camps": ["https://njycamps.org/friends/donate/", ""],
  "Ranch Camp": ["https://www.ranchcamp.org/donate/", ""],
  "Moshava Alevy": ["https://www.moshavaalevy.org/support-moshava", ""],
  "Sephardic Adventure Camp": ["http://www.sephardicadventurecamp.org/about/donors/", ""],
  "Shwayder Camp": ["https://www.shwayder.com/support/", ""],
  "Tiyul Adventure Camp": ["https://www.pearlstonecenter.org/donate/", ""],
  "URJ 6 Points Creative Arts Academy": ["https://6pointscreativearts.org/give/", ""],
  "URJ 6 Points Sci-Tech Academy East": ["https://6pointsscitech.org/give/", ""],
  "URJ 6 Points Sci-Tech Academy West": ["https://6pointsscitech.org/give/", ""],
  "URJ 6 Points Sports Academy North Carolina": ["https://6pointssports.org/give/", ""],
  "URJ Camp Coleman": ["https://campcoleman.org/give/", ""],
  "URJ Camp Harlam": ["https://campharlam.org/give/", ""],
  "URJ Camp Kalsman": ["https://campkalsman.org/give/", ""],
  "URJ Camp Newman": ["https://campnewman.org/support-newman/donate/", ""],
  "URJ Crane Lake Camp": ["https://donate.reformjudaism.org/campaign/hineini-2020/c285490", ""],
  "URJ Eisner Camp": ["https://donate.reformjudaism.org/campaign/hineini-2020/c285490", ""],
  "URJ Greene Family Camp": ["https://greene.org/support-greene/", ""],
  "URJ Camp George": ["https://campgeorge.org/give/", ""],
  "URJ Goldman Union Camp Institute (GUCI)": ["https://guci.org/give/", ""],
  "URJ Henry S. Jacobs Camp": ["https://jacobscamp.org/give/", ""],
  "URJ Olin-Sang-Ruby Union Institute (OSRUI)": ["https://osrui.org/give/", ""],
  "Camp Morasha": ["https://campmorasha.com/the-morasha-experience/giving-back", ""],
  "Perlman Camp": ["https://www.perlmancamp.org/donate/", ""],
  "Camp Tel Yehudah": ["https://www.telyehudah.org/give/", ""],
  "Camp Towanda": ["", ""],
  "Birthright Israel Excel": ["https://www.birthrightisraelexcel.com/#/supportus", ""],
  "Agudath Israel": ["https://www.agudath.org/donate-now.html", ""],
  "Temple Aliyah": ["https://www.templealiyah.org/donate.html", "Temple Aliyah.png"],
  "West Chester University Hillel": ["https://fs9.formsite.com/phillyhillel/WCUHillel/index.html", ""]};

// An array containing all the org names
var orgs = Object.keys(org_dict);

// Function to extract parameters from URL
function getParams(url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};
