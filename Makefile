# Makefile for Web Server Quest Doc
# =================================

default: all

all: doc

clean:
	rm -rf doc

doc: clean
	docker \
	--colour_scheme pastie \
	--ignore_hidden \
	--sidebar yes \
	--exclude lib,doc \
	--line-numbers

auto: clean
	docker \
	--colour_scheme pastie \
	--ignore_hidden \
	--sidebar yes \
	--exclude lib,doc \
	--line-numbers \
	--watch

update:
	docker \
	--updated_files \
	--colour_scheme pastie \
	--ignore_hidden \
	--sidebar yes \
	--exclude lib,doc \
	--line-numbers
