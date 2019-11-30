class Video_player{
    constructor(){
        this.$video_player = document.querySelector('.js_video_player')
        this.$video = this.$video_player.querySelector('video')
        this.$video.volume = 0.5
        
        this.$seek_bar_container = this.$video_player.querySelector('.js_seek_bar_container')
        this.$seek_bar_pin = this.$seek_bar_container.querySelector('.js_seek_bar_pin')
        this.$seek_bar_current = this.$seek_bar_container.querySelector('.js_seek_bar_current')
        this.$seek_bar = this.$seek_bar_container.querySelector('.js_seek_bar')
        this.set_seek_bar()
        this.$play_pause_button = this.$video_player.querySelector('.js_play_pause_button')
        this.$play_pause_button_icon = this.$play_pause_button.querySelectorAll('svg')
        this.set_play_pause()
        this.$volume_button = this.$video_player.querySelector('.js_volume_button')
        this.$volume_button_muted = this.$volume_button.querySelector('.js_volume_button_muted')
        this.$volume_slider_container = this.$video_player.querySelector('.js_volume_slider_container')
        this.$volume_slider_min = this.$volume_slider_container.querySelector('.js_volume_slider_min')
        this.$volume_slider_max = this.$volume_slider_container.querySelector('.js_volume_slider_max')
        this.$volume_slider_bar_container = this.$volume_slider_container.querySelector('.js_volume_slider_bar_container')
        this.$volume_slider_bar = this.$volume_slider_bar_container.querySelector('.js_volume_slider_bar')
        this.$volume_slider_bar_level = this.$volume_slider_bar_container.querySelector('.js_volume_slider_bar_level')
        this.$volume_slider_bar_pin = this.$volume_slider_bar_container.querySelector('.js_volume_slider_bar_pin')
        this.set_volume()
        this.$video_show_time = this.$video_player.querySelector('.js_video_show_time')
        this.set_show_time()
    }
    // play pause button
    set_play_pause(){
        // play pause function
        const play_pause = ()=>{
            this.$play_pause_button_icon.forEach(($, key)=>{
                $.classList.toggle('fade-out')
                if (key == 0 && this.$play_pause_button_icon[key].classList.contains('fade-out'))
                    this.$video.play()
                else if (key == 1 && this.$play_pause_button_icon[key].classList.contains('fade-out'))
                    this.$video.pause()
            })
        }
        // play pause on button clicking
        this.$play_pause_button.addEventListener('click', play_pause)
        // play pause on presssing spacebar
        document.addEventListener(
            'keypress',
            (_event)=>{
                // prevent from double play/pause pressing because of focused element 
                let isFocused = (document.activeElement === this.$play_pause_button)
                if(_event.code == 'Space' && !isFocused)
                    play_pause()
            }
        )
        // play pause on video clicking
        this.$video.addEventListener('click', play_pause)
    }
    // check if volume is muted or not | set slider bar level | set pin position depending on the volume
    check_volume_min_max(){
        // add/remove animation class
        if (this.$video.volume == 0){
            this.$volume_button_muted.classList.remove('inactive')
            window.requestAnimationFrame(()=>{
                window.requestAnimationFrame(()=>{
                    this.$volume_button_muted.classList.add('active')
                })
            })
        }
        else if(this.$video.volume > 0){
            this.$volume_button_muted.classList.remove('active')
            window.requestAnimationFrame(()=>{
                window.requestAnimationFrame(()=>{
                    this.$volume_button_muted.classList.add('inactive')
                })
            })
        }
        // set volume bar depending on volume
        this.$volume_slider_bar_pin.style.transform = `translate(${this.$video.volume*100/(100/60)}px)`
        this.$volume_slider_bar_level.style.width = `${this.$video.volume*100/(100/60)}px`
    }
    // set volume with the slider
    set_volume(){
        // volume button - set volume min & max (muted or not)
        this.$volume_button.addEventListener(
            'click',
            ()=>{
                if(this.$video.volume > 0)
                    this.$video.volume = 0
                else if(this.$video.volume == 0)
                    this.$video.volume = 0.5
                this.check_volume_min_max()
            }
        )
        // set volume min (muted)
        this.$volume_slider_min.addEventListener(
            'click',
            () => {
                this.$video.volume = 0
                this.check_volume_min_max()

            }
        )
        // set volume max (not muted)
        this.$volume_slider_max.addEventListener(
            'click',
            ()=>{
                this.$video.volume = 1
                this.check_volume_min_max()
            }
        )

        // volume slider
            // mouse move
        const volume_handle_mousemove = ()=>{
            volume_handle_mouseup()
            this.$volume_slider_bar_container.addEventListener('mousemove', volume_handle_mousemove_function)
        }
        const volume_handle_mousemove_function = (_event)=>{
            const bounding = this.$volume_slider_bar.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left -5) / (bounding.width-10) // pin width = 5px 
            let temp = Math.floor(((ratio)*50))/50
                // include volume in 0 to 1
            if (temp > 1)
                temp = 1
            else if (temp < 0){
                temp = 0
            }
            this.$video.volume = temp
            this.$volume_slider_bar_pin.style.transform = `translate(${temp*100/(100/60)}px)`
            this.$volume_slider_bar_level.style.width = `${temp*100/(100/60)}px`
        }
            // mouse up
        const volume_handle_mouseup = (_event)=>{window.addEventListener('mouseup', volume_handle_mouseup_function)} // muted animation when mouse up if volume = 0
        const volume_handle_mouseup_function = (_event)=>{
            volume_handle_mousemove_function(_event)
            // remove mousemove eventlistener
            this.$volume_slider_bar_container.removeEventListener('mousemove', volume_handle_mousemove_function)
            // remove mouseup event listener
            window.removeEventListener('mouseup', volume_handle_mouseup_function)
            this.check_volume_min_max()
        }

            // mouse down
        this.$volume_slider_bar_container.addEventListener('mousedown', volume_handle_mousemove)
    }
    // set seek bar
    set_seek_bar(){
        // seek bar & seek bar pin animation class
        this.$seek_bar_container.addEventListener(
            'mouseenter',
            ()=>{
            this.$seek_bar.classList.remove('inactive')
            this.$seek_bar_current.classList.remove('inactive')
            this.$seek_bar_pin.classList.remove('inactive')
            window.requestAnimationFrame(()=>{
                window.requestAnimationFrame(()=>{
                    this.$seek_bar.classList.add('active')
                    this.$seek_bar_current.classList.add('active')
                    this.$seek_bar_pin.classList.add('active')
                })
            })
        })
        // seek bar & seek bar pin animation class
        this.$seek_bar_container.addEventListener(
            'mouseleave',
            ()=>{
            this.$seek_bar.classList.remove('active')
            this.$seek_bar_current.classList.remove('active')
            this.$seek_bar_pin.classList.remove('active')
            window.requestAnimationFrame(()=>{
                window.requestAnimationFrame(()=>{
                    this.$seek_bar.classList.add('inactive')
                    this.$seek_bar_current.classList.add('inactive')
                    this.$seek_bar_pin.classList.add('inactive')
                })
            })
        })

        // seek bar auto update
        this.$video.addEventListener(
            'timeupdate',
            ()=>{
                const ratio = this.$video.currentTime / this.$video.duration
                // seek bar current moving depending on the current time
                this.$seek_bar_current.style.transform = `scaleX(${ratio})`
                // seek bar pin moving depending on the current time
                this.$seek_bar_pin.style.transform = `translateX(${(this.$seek_bar_container.offsetWidth * ratio)-this.$seek_bar_pin.offsetWidth/2}px)`
            }
        )
        // on click, go to the time of a video
        this.$seek_bar_container.addEventListener(
            'click',
            (_event)=>{
                const bounding = this.$seek_bar_container.getBoundingClientRect()
                const ratio = (_event.clientX - bounding.left) / bounding.width
                this.$video.currentTime = ratio * this.$video.duration
            }
        )















    //     const volume_handle_mousemove = ()=>{
    //         volume_handle_mouseup()
    //         this.$volume_slider_bar_container.addEventListener('mousemove', volume_handle_mousemove_function)
    //     }
    //     const volume_handle_mousemove_function = (_event)=>{
    //         const bounding = this.$volume_slider_bar.getBoundingClientRect()
    //         const ratio = (_event.clientX - bounding.left -5) / (bounding.width-10) // pin width = 5px 
    //         let temp = Math.floor(((ratio)*50))/50
    //             // include volume in 0 to 1
    //         if (temp > 1)
    //             temp = 1
    //         else if (temp < 0){
    //             temp = 0
    //         }
    //         this.$video.volume = temp
    //         this.$volume_slider_bar_pin.style.transform = `translate(${temp*100/(100/60)}px)`
    //         this.$volume_slider_bar_level.style.width = `${temp*100/(100/60)}px`
    //     }
    //         // mouse up
    //     const volume_handle_mouseup = (_event)=>{window.addEventListener('mouseup', volume_handle_mouseup_function)} // muted animation when mouse up if volume = 0
    //     const volume_handle_mouseup_function = (_event)=>{
    //         volume_handle_mousemove_function(_event)
    //         // remove mousemove eventlistener
    //         this.$volume_slider_bar_container.removeEventListener('mousemove', volume_handle_mousemove_function)
    //         // remove mouseup event listener
    //         window.removeEventListener('mouseup', volume_handle_mouseup_function)
    //         this.check_volume_min_max()
    //     }

    //         // mouse down
    //     this.$volume_slider_bar_container.addEventListener('mousedown', volume_handle_mousemove)
    // }













    }
    set_show_time(){
        // const duration_hour = this.$video.duration % 3600
        // const duration_min = duration_hour % 60
        // const duration_second = duration_min % 60
        // console.log(duration_hour);
        // console.log(duration_min);
        // console.log(duration_second);

        
        
        




        this.$video.addEventListener(
            'timeupdate',
            ()=>{
                console.log(this.$video.duration);
            }
        )
        
    }

}



const video_player = new Video_player()