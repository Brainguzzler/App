empty :=
space := $(empty) $(empty)

DIST_DIR ?= dist
DEB_DIR = $(DIST_DIR)/deb
PORTAL_DIR = $(DEB_DIR)/srv/www/smfpl-payment-rack-client
LIB_PATH =

clean:
	rm -rf dist


test:
	#

compile:
        # Nothing to compile here


package:
	mkdir -p $(DEB_DIR)/DEBIAN
	cp control $(DEB_DIR)/DEBIAN
	cp conffiles $(DEB_DIR)/DEBIAN
	cp postinst $(DEB_DIR)/DEBIAN
	chmod 755 $(DEB_DIR)/DEBIAN/postinst
	find $(DIST_DIR) -name '.gitignore' -delete
	mkdir -p $(PORTAL_DIR)
	rm -rf $(WEB_ROOT)/public
	rm -rf $(WEB_ROOT)/src
	cp -r app/build/* $(PORTAL_DIR)
	mkdir -p $(DEB_DIR)/etc/nginx/sites-available
	cp vhost.nginx $(DEB_DIR)/etc/nginx/sites-available/smfpl-payment-rack-client.conf
	dpkg-deb --build $(DEB_DIR) $(DIST_DIR)
