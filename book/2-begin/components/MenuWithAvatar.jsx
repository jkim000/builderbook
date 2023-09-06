import React from 'react';

import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(Object).isRequired,
};

class MenuWithAvatar extends React.Component {
    consturctor() {
        super();

        this.state = {
            anchorEl: undefined,
        };
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorel: undefined });
    };

    render() {
        const { options, src, alt } = this.props;
        const { anchorEl } = this.state;

        return (
            <div>
                <Avatar
                    aria-controls={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    onKeyPress={this.handleClick}
                    src={src}
                    alt={alt}
                    style={{ margin: '0px 20px 0px auto', cursor: 'pointer' }}
                />
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {options.map((option) => (
                        <div id="wrappingLink" key={option.text}>
                            {option.anchor ? (
                                <MenuItem
                                    onClick={(event) => {
                                        event.preventDefault();
                                        window.location.href = option.href;
                                        this.handleClose();
                                    }}
                                >
                                    {option.text}
                                </MenuItem>
                            ) : (
                                <Link href={option.href} as={option.as || option.href}>
                                    <MenuItem>{option.text}</MenuItem>
                                </Link>
                            )}
                        </div>
                    ))}
                </Menu>
            </div>
        );
    }
}

MenuWithAvatar.propTypes = propTypes;

export default MenuWithAvatar;
