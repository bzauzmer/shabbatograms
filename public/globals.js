// Confirguation information for submitting form to Firebase
var config = {
  apiKey: "AIzaSyCsVANHYhX6PL4hpBb_tUWyNhXeaZe9m8s",
  authDomain: "shabbatograms.firebaseapp.com",
  databaseURL: "https://shabbatograms.firebaseio.com",
  projectId: "shabbatograms",
  storageBucket: "shabbatograms.appspot.com",
};

// Dictionary mapping camp names to donation links
var camp_dict = {"Beber Camp": "https://www.bebercamp.com/donate/",
                 "B\'Nai Brith Camp Manitoba": "https://www.bbcamp.ca/camperships",
                 "B\'Nai Brith Camp Oregon": "https://bbcamp.org/donate-now/",
                 "Camp Alonim": "https://www.alonim.com/donate/",
                 "Camp Avoda": "https://campavoda.org/giving/",
                 "Camp Ben Frankel": "https://www.campbenfrankel.org/donate",
                 "Camp Bob Waldorf": "https://campbobwaldorf.org/donate/",
                 "Camp Daisy and Harry Stein": "https://www.formstack.com/forms/?1841574-Jl7EdW2ygu",
                 "Camp Dora Golding": "https://campdoragolding.com/campers-and-parents/donate/",
                 "Camp Gan Israel in The Poconos": "http://cgipoconos.org/donatenow/",
                 "Camp Hatikvah": "https://www.paypal.com/donate/?token=iaR82gs6IdrgPIzfvfWbBm7sPYFlxoeVM20WFQypItoBhSpP-wmhq4_IJahj9O2uNPppGG&country.x=CA&locale.x=CA",
                 "Camp Havaya": "https://camphavaya.org/support/",
                 "Camp Judaea": "https://www.campjudaea.org/support/giving-opportunities/",
                 "Camp Kadimah": "https://interland3.donorperfect.net/weblink/weblink.aspx?name=E348513QE&id=27",
                 "Camp Kinder Ring": "https://www.campkr.com/donate-to-kinder-ring/",
                 "Camp Livingston": "https://www.camplivingston.com/make-an-impact/",
                 "Camp Massad Manitoba": "https://campmassad.ca/donate-support/support-massad/",
                 "Camp Massad Montreal": "https://campmassad.org/donations.html",
                 "Camp Moshava Ennismore": "https://campmoshava.org/donate/",
                 "Camp Moshava Indian Orchard": "https://moshavaio.campintouch.com/ui/forms/donor/Form",
                 "Camp Mountain Chai": "http://www.campmountainchai.com/support-cmc/",
                 "Camp Nageela East": "https://campnageela.campintouch.com/ui/forms/donor/Form",
                 "Camp Nageela Midwest": "https://pay.banquest.com/nageelamidwest",
                 "Camp Northland - B\'Nai Brith": "https://www.campnbb.com/donate-now.html",
                 "Camp Pardas Chanah": "https://www.camppc.com/donate/",
                 "Camp Ramah Darom": "https://www.ramahdarom.org/ramah-darom-donation-form/",
                 "Camp Ramah in California": "https://ramah.org/support-ramah/",
                 "Camp Ramah in Canada": "https://campramah.com/donate/",
                 "Camp Ramah in New England": "https://www.campramahne.org/giving/",
                 "Camp Ramah in Northern California": "https://www.ramahnorcal.org/donors/donate/",
                 "Camp Ramah in the Berkshires": "https://www.ramahberkshires.org/donate/",
                 "Camp Ramah in the Poconos": "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=E3940&id=3",
                 "Camp Ramah in the Rockies": "https://payments.cliq.com/Donation/ramah",
                 "Camp Ramah in Wisconsin": "https://give.ramahwisconsin.com/give/286404/#!/donation/checkout",
                 "Camp Sabra": "https://www.campsabra.com/support/",
                 "Camp Solomon Schechter": "https://www.campschechter.org/donate-now/",
                 "Camp Stone": "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=76LK8HJ4TSQA2&source=url",
                 "Camp Tawonga": "http://tawonga.org/support/donate/",
                 "Camp Tel Noar": "https://secure.qgiv.com/for/telnoar/",
                 "Camp Tevya": "https://secure.qgiv.com/for/tevya",
                 "Camp Wise": "https://online.mandeljcc.org/OnlineEdge/fundraising.html?event=Refresh&Fund=Camp%20Wise",
                 "Camp Young Judaea Midwest": "https://www.cyjmid.org/donate/",
                 "Camp Young Judaea New Hampshire": "https://www.campyoungjudaea.com/donate-1",
                 "Camp Young Judaea Sprout Lake": "https://www.cyjsproutlake.org/donate/",
                 "Camp Young Judaea Texas": "https://www.cyjtexas.org/?form=covid19",
                 "Camp Zeke": "https://campzeke.org/",
                 "Capital Camps": "https://capitalcamps.org/donate-now/?t=new",
                 "Eden Village Camp": "https://edenvillagecamp.org/support-us/",
                 "Eden Village West": "https://www.edenvillagewest.org/support-us",
                 "Emma Kaufmann Camp": "https://emmakaufmanncamp.com/donate/",
                 "Golden Slipper Camp": "http://goldenslippercamp.org/donate/",
                 "Habonim Dror Camp Galil": "https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=k7N2dt8P2C&pg_return_url=http%3A%2F%2Fwww.campgalil.org%2Fabout%2Fthank_you%2F",
                 "Habonim Dror Camp Gesher": "https://www.canadahelps.org/en/charities/camp-gesher/",
                 "Habonim Dror Camp Gilboa": "https://www.campgilboa.org/give",
                 "Habonim Dror Camp Moshava": "https://www.campmosh.org/give",
                 "Habonim Dror Camp Tavor": "https://www.camptavor.org/donate",
                 "Hashomer Hatzair Camp Shomria Us": "https://www.campshomria.com/donate.html",
                 "Havaya Arts": "https://havayaarts.org/support/",
                 "J. Academy Camp": "https://fundraising.srcentre.ca/",
                 "JCC Camp Chi": "https://campchi.jccchicago.org/donate/",
                 "JCC Camp Kingswood": "https://www.bostonjcc.org/donate",
                 "JCC Maccabi Sports Camp": "http://www.maccabisportscamp.org/support-camp/",
                 "JCC Ranch Camp": "https://www.ranchcamp.org/donate/",
                 "Moshava Alevy": "https://www.moshavaalevy.org/support-moshava",
                 "Pinemere Camp": "https://www.pinemere.com/pinemere-alumni/donate-to-pinemere/",
                 "Ramah Sports Academy": "https://46767.thankyou4caring.org/pages/rsa/donate",
                 "Sephardic Adventure Camp": "http://www.sephardicadventurecamp.org/about/donors/",
                 "Shalom Institute": "https://shalominstitute.com/support-us/donations/",
                 "Shwayder Camp of Temple Emanuel": "https://www.shwayder.com/support/",
                 "Surprise Lake Camp": "https://interland3.donorperfect.net/weblink/WebLink.aspx?name=E12841&id=18",
                 "Tamarack Camps": "https://tamarackcamps.com/giving/support/",
                 "Tiyul Summer Adventures at the Pearlstone Center": "https://www.pearlstonecenter.org/donate/",
                 "URJ 6 Points Creative Arts Academy": "https://6pointscreativearts.org/give/",
                 "URJ 6 Points Sci-Tech Academy East": "https://6pointsscitech.org/give/",
                 "URJ 6 Points Sci-Tech Academy West": "https://6pointsscitech.org/give/",
                 "URJ 6 Points Sports Academy North Carolina": "https://6pointssports.org/give/",
                 "URJ Camp Coleman": "https://campcoleman.org/give/",
                 "URJ Camp George": "https://campgeorge.org/give/",
                 "URJ Camp Harlam": "https://campharlam.org/give/",
                 "URJ Camp Kalsman": "https://campkalsman.org/give/",
                 "URJ Camp Newman": "https://campnewman.org/support-newman/donate/",
                 "URJ Crane Lake Camp": "https://donate.reformjudaism.org/campaign/hineini-2020/c285490",
                 "URJ Eisner Camp": "https://donate.reformjudaism.org/campaign/hineini-2020/c285490",
                 "URJ Goldman Union Camp Institute": "https://guci.org/give/",
                 "URJ Greene Family Camp": "https://greene.org/support-greene/",
                 "URJ Henry S. Jacobs Camp": "https://jacobscamp.org/give/",
                 "URJ Olin-Sang-Ruby Union Institute": "https://osrui.org/give/",
                 "Wilshire Boulevard Camps": "https://www.wbtcamps.org/support-our-camps",
                 "Y Country Camp": "https://frd.akaraisin.com/Donation/Event/Home.aspx?seid=8085&mid=8&Lang=en-CA",
                 "Yachad Summer Programs": "https://www.yachad.org/summer/donate"}

// An array containing all the camp names
var camps = Object.keys(camp_dict);
